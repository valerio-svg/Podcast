"use strict";

import page from '//unpkg.com/page/page.mjs';
import Api from './api.js';
import Buy from './buy.js';
import Filter from './filter.js';
import Follow from './follow.js';
import Favorite from './favorite.js';
import { createLogin } from './templates/createLogin.js';
import { createSignIn } from './templates/createSignIn.js';
import { createAddPodcast } from './templates/createAddPodcast.js';
import { createAddEpisode } from './templates/createAddEpisode.js';
import { createPayEpisode } from './templates/createPayEpisode.js';
import { createShowDataUser } from './templates/createShowDataUser.js';
import { createCommentEpisode } from './templates/createCommentEpisode.js';
import { createDetailPodcastTable, createPodcastRow, createEpisodeRow } from './templates/createDetailPodcastTable.js';

class App {
    constructor(podcastContainer, dropdownMenuContainer) {
        // Container principale podcast
        this.podcastContainer = podcastContainer;
        // Menu' a tendina (categorie)
        this.dropdownMenuContainer = dropdownMenuContainer;
        // Filtri
        this.filter = new Filter(dropdownMenuContainer);

        // Modali
        this.containerLogin = document.querySelector('#modalLogin');
        this.containerSignIn = document.querySelector('#modalSignIn');
        this.containerAddPocast = document.querySelector('#modalAddPodcast');
        this.containerAddEpisode = document.querySelector('#modalAddEpisode');
        this.containerDataUser = document.querySelector('#modalDataUser');
        // Pulsante di logout
        this.logOutLink = document.querySelector('#logout');
        // Dati utente
        this.user = null;
    
        // Template per Login - Iscrizione - AggiuntaPodcast - AggiuntaEpisodi
        this.containerLogin.innerHTML = createLogin();
        this.containerSignIn.innerHTML = createSignIn();
        this.containerAddPocast.innerHTML = createAddPodcast();
        this.containerAddEpisode.innerHTML = createAddEpisode();

        // 'login-form' e' l'id ottenuto dal form creato con il template
        // viene intercettato l'evento di submit con un addEventListener, 
        // viene poi richiamata la funzione 'onLoginSubmitted'
        document.getElementById('login-form').addEventListener('submit', this.onLoginSubmitted);
        document.getElementById('signin-form').addEventListener('submit', this.onSignInSubmitted);
        document.getElementById('addPodcast-form').addEventListener('submit', this.onAddPodcastSubmitted);
        document.getElementById('addEpisode-form').addEventListener('submit', this.onAddEpisodeSubmitted);
        // Evento di click per il LogOut
        this.logOutLink.addEventListener('click', this.logOut);

        // Controllo che l'utente sia loggato
        if(localStorage.getItem('user_id') && localStorage.getItem('username')) {
            this.user = {
                user_id: localStorage.getItem('user_id'),
                username: localStorage.getItem('username')
            }
            // Funzione che aggiunge/rimuove pulsanti nel caso in cui l'utente
            // sia loggato come ascoltatore/creatore
            this.userLogged(this.user);
        }

        // Route principale (Homepage)
        page('/', () => {
            this.clearPodcast();
            document.querySelectorAll('.podcastUser').forEach(el => {
                el.classList.add('invisible');
            });
            // Carico tutti i podcast
            this.getAllPodcast().then(podcast => {
                // Visualizzo i podcast
                this.showPodcast(podcast);
                // Evento di click su ogni singolo podcast
                this.clickPodcast();
            });
            // Azione per i filtri
            this.filterAction();
        });

        // Route con l'id del Podcast appena cliccato,
        // contiene anche i relativi episodi
        page('/:podcast_id', () => {
            document.getElementById('category').setAttribute('disabled', true);
            this.clearPodcast();
            // URL
            let loc = window.location.href; 
            // Estraggo l'id (l'ultimo elemento dell'url)
            let id = loc.substr(loc.lastIndexOf('/') + 1);
            // Carico il podcast con l'id preso dall'URL
            this.getPodcastId(id).then(pod => {
                // Visualizzo dettagli del podcast e episodi
                this.showPodcastEpisodeId(pod);
            });
        });

        this.showFollow(); // visualizzo seguiti dell'utente
        this.showFavorite(); // visualizzo preferiti dell'utente

        if(this.user) {
            document.getElementById('data-user').removeAttribute('disabled');
            this.showDataUser(parseInt(localStorage.getItem("user_id"))); // visualizzo dati utente
        } else {
            document.getElementById('data-user').setAttribute('disabled', true);
            localStorage.clear();
        }

        document.getElementById('homepage').addEventListener('click', () => {
            document.getElementById('category').removeAttribute('disabled');
        });

        document.getElementById('category').removeAttribute('disabled');
        
        page();

        // Ricerca
        this.search();
    }

    onCategorySelected = async (event) => {
        this.getAllPodcast().then(p => {
            // Svuoto la pagina dei podcast
            if (this.clearPodcast() !== '') {
                this.clearPodcast();
            }
            this.showPodcast(event.detail);
            this.clickPodcast();
        });
        this.filterAction();
    }

    // Funzione che visualizza le cover dei podcast nell'index (homepage)
    // al passaggio del cursore sull'immagine sara' mostrato il titolo del relativo podcast
    showPodcast(podcast) {
        podcast.forEach(pod => {
            const img = `<img id="${pod.podcast_id}" src="/images/${pod.image}" 
                            class="align-self-end size-img-index effect-img" 
                            alt="img" title="${pod.title}">`;

            this.podcastContainer.insertAdjacentHTML('afterbegin', img);
        });
    }

    // Funzione che visualizza i dettagli relativi al podcast cliccato e i relativi episodi
    // Contiene anche varie funzionalita': 
    // Podcast e Episodi (cancellazione e modifica),
    // Commenti (aggiunta/modifica/cancellazione),
    // Preferiti e Follower (per entrambi aggiunta e eliminazione)
    showPodcastEpisodeId = async (podcast) => {
        this.clearPodcast();
        // Template per la pagina relativa ai dettagli dei podcast e degli episodi
        this.podcastContainer.innerHTML = createDetailPodcastTable(podcast);
            
        // my-podcast-detail -> id della tabella relativa ai dettagli del podcast
        const detailPodcastTable = document.querySelector('#my-podcast-detail');
        const podcastRow = createPodcastRow(podcast);
        detailPodcastTable.insertAdjacentHTML('beforeend', podcastRow);
                
        // Se l'utente e' il creatore del podcast
        // visualizzo pulsanti per la modifica e la cancellazione del podcast
        if((this.user && this.user.user_id) == podcast.user_id) {
            document.querySelectorAll('.podcastUser').forEach(el => {
                el.classList.remove('invisible');
            });
            const buttonDelete = document.getElementById('deletePodcastButton');
            buttonDelete.addEventListener('click', this.onDeletePodcast);
            
            const modifyForm = document.getElementById('modifyPodcast-form');
            modifyForm.elements['category'].value = podcast.category;
            modifyForm.addEventListener('submit', this.onModifyPodcastSubmitted);  
        } else {
            if(this.user) {
                // Follow - aggiunta - eliminazione
                // html per il bottone 'follow'
                let rowFollowButton = document.getElementById('row-follow-button');
                const buttonFollow = document.createElement('button');
                buttonFollow.id = "follow";

                let follow = await Api.getFollow(parseInt(localStorage.getItem('user_id')), podcast.podcast_id);
                if(follow.error === "Follow not found.") {
                    buttonFollow.innerHTML = "Segui il Podcast";
                    buttonFollow.className = "btn btn-dark color-follow-add size-button-follow";
                } else {
                    buttonFollow.innerHTML = "Smetti di seguire il Podcast";
                    buttonFollow.className = "btn btn-danger color-follow-remove size-button-follow";
                }           
                rowFollowButton.appendChild(buttonFollow);

                document.getElementById('follow').addEventListener('click', async () => {
                    let user_follow_id = parseInt(localStorage.getItem("user_id"));
                    if(document.getElementById('follow').innerHTML === "Segui il Podcast") {
                        await Api.addFollow(new Follow(user_follow_id, podcast.podcast_id));
                        location.reload();
                    } else {
                        await Api.deleteFollow(user_follow_id, podcast.podcast_id);
                        location.reload();
                    }
                });
            }
        }
        // Nella variabile 'ep' viene restituito un'array con tutti gli episodi di un podcast
        const ep = await Api.getAllEpisodeFromPodcast(podcast.podcast_id);
        ep.sort();
        for(let episode of ep) {
            // Controlli per settare il prezzo dell'episodio e sponsor
            if(episode.sponsor===null || episode.sponsor==="") episode.sponsor = "";
            if(episode.price===null || episode.price==="€" || episode.price==="0€") episode.price = "GRATIS";
            else episode.price = episode.price;
            
            // my-episode-detail -> id della tabella relativa agli episodi
            const detailEpisodeTable = document.querySelector('#my-episode-detail');
            const episodeRow = createEpisodeRow(episode);
            detailEpisodeTable.insertAdjacentHTML('afterbegin', episodeRow);

            // Se l'episodio e' gratuito oppure l'utente corrente e' il creatore del podcast,
            // lo rendo disponibile per l'ascolto inserendo la directory con il file audio 
            if(episode.price === 'GRATIS' || episode.price === '€' || parseInt(localStorage.getItem('user_id')) === podcast.user_id)
                document.getElementById("player").src = '/audio/' + episode.audio;
            
            // Commenti - Aggiunta - Modifica - Eliminazione
            let rowCommentButton = document.getElementById('row-comment-button');
            let buttonComment = `<button id="button-comment" type="button" class="modal-dialog-scrollable btn btn-light" title="Commenta" data-toggle="modal" data-target="#modalCommentEpisode" >
                                    <svg width="1.3em" height="1.3em" viewBox="0 0 16 16" class="bi bi-chat-left-text-fill color-icon-comment" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793V2zm3.5 1a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5z"/>
                                    </svg>
                                </button>`;
            let buttonDeleteComment = `<button id="button-delete-comment" type="button" class="btn btn-danger">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                            </svg>
                                        </button>`;
            rowCommentButton.innerHTML = createCommentEpisode();
            rowCommentButton.insertAdjacentHTML('afterbegin', buttonComment);

            // La variabile 'comment' conterra' tutti i commenti di un determinato episodio
            let comment = await Api.getComment(podcast.podcast_id, episode.episode_id);
            document.getElementById('button-comment').addEventListener('click', () => {
                document.getElementById('title').innerText = "Commenti episodio: " + episode.name;
                let commentEpisode = document.getElementById('all-comment');
                // Svuoto il contenitore per i commenti
                commentEpisode.innerHTML = '';
                comment.forEach(c => {
                    const ul = document.createElement('ul');
                    ul.className = "list-group list-group-horizontal";
                    commentEpisode.appendChild(ul);

                    const liUser = document.createElement('li');
                    liUser.className = "list-group-item comment-user list-group-item-action";
                    const liComment = document.createElement('li');
                    liComment.className = "list-group-item list-group-item-action";
                    const liDeleteComment = document.createElement('li');
                    liDeleteComment.className = "list-group-item deleteCommentUser list-group-item-action";

                    this.getUserById(c.user_id).then(u => {
                        liUser.innerHTML = `${u.username}`;
                        ul.appendChild(liUser);
                        liComment.innerHTML = `${c.text}`;
                        ul.appendChild(liComment);

                        if(parseInt(localStorage.getItem('user_id')) === c.user_id) {
                            // Pulsante per eliminare il commento
                            liDeleteComment.innerHTML = buttonDeleteComment;
                            ul.appendChild(liDeleteComment);
                        }
                    });
                        
                    // Se l'utente ha scritto il commento
                    if (parseInt(localStorage.getItem('user_id')) === c.user_id) {
                        // Rendo editabile il campo con il commento
                        liComment.contentEditable = true;
                        // Modifica commento
                        liComment.addEventListener("keyup", async (event) => {
                            // Il numero 13 e' il pulsante di 'Invio' sulla tastiera
                            // keyCode deprecato -> vedi README.txt
                            if (event.keyCode === 13) {
                                event.preventDefault();
                                let text_comment = liComment.innerText;
                                text_comment = text_comment.replace(/(\r\n|\n|\r)/gm, "");
                                const comment = {
                                    episode_id: episode.episode_id,
                                    podcast_id: podcast.podcast_id,
                                    user_id: parseInt(localStorage.getItem('user_id')),
                                    text: text_comment
                                }
                                if(comment.text !== "") {
                                    await Api.updateComment(c.comment_id, comment);
                                    location.reload();
                                }
                            }
                        });
                        // Eliminazione commento
                        liDeleteComment.addEventListener('click', async () => {
                            await Api.deleteComment(c.comment_id);
                            location.reload();
                        });
                    }
                });
                const divInput = document.createElement("div");
                commentEpisode.append(divInput);
                const liCommentInput = document.createElement('input');
                liCommentInput.type = "text";
                liCommentInput.id = "textinputComment";
                liCommentInput.placeholder = "Commenta qui (Invio per confermare)"
                liCommentInput.className = "list-group-item list-group-item-action";
                liCommentInput.contentEditable = true;
                divInput.appendChild(liCommentInput);

                liCommentInput.addEventListener("keyup", async (event) => {
                    // Il numero 13 e' il pulsante di 'Invio' sulla tastiera
                    // keyCode deprecato -> vedi README.txt
                    if (event.keyCode === 13) {
                        event.preventDefault();
                        if(localStorage.getItem('user_id') != null) {
                            const comment = {
                                podcast_id: podcast.podcast_id,
                                episode_id: episode.episode_id,
                                user_id: parseInt(localStorage.getItem('user_id')),
                                text: document.getElementById('textinputComment').value
                            }
                            if(comment.text === "") window.alert("Impossibile commentare");
                            else {
                                await Api.addComment(comment);
                                location.reload();
                            }
                        }
                    }
                });
            });
            
            // Se l'utente e' il creatore del podcast
            if((this.user && this.user.user_id) == podcast.user_id) { 
                // Rendo visibili i pulsanti di modifica e rimozione degli episodi
                document.querySelectorAll('.episodeUser').forEach(el => {
                    el.classList.remove('invisible');
                });
                const buttonDeleteEpisode = document.getElementById('deleteEpisodeButton');
                buttonDeleteEpisode.addEventListener('click', () => this.onDeleteEpisode(episode.episode_id));

                const buttonModifyEpisode = document.getElementById('modifyEpisodeButton');
                buttonModifyEpisode.addEventListener('click', () => {
                    const modifyFormEpisode = document.getElementById('modifyEpisode-form');
                    modifyFormEpisode.elements['title'].value = episode.name;
                    modifyFormEpisode.elements['audio'].value = episode.audio;
                    modifyFormEpisode.elements['description'].value = episode.description;
                    modifyFormEpisode.elements['sponsor'].value = episode.sponsor;

                    if(episode.price==="GRATIS") modifyFormEpisode.elements['price'].value = "";
                    else {
                        // con .slice elimino l'ultimo carattere, ovvero €
                        // cosi' aggiungo il simbolo solamente quando effettuo la modifica
                        modifyFormEpisode.elements['price'].value = episode.price.slice(0,-1); 
                    }

                    modifyFormEpisode.addEventListener('submit', async () => {
                        // event deprecato -> vedi README.txt
                        event.preventDefault();
                        const form = event.target;
                        if(form.checkValidity()) {
                            try {
                                const newEpisode = {
                                    name: form.title.value,
                                    audio: form.audio.value,
                                    description: form.description.value,
                                    sponsor: form.sponsor.value,
                                    price: form.price.value,
                                    episode_id: episode.episode_id
                                }
                                if(newEpisode.price===null || newEpisode.price==="" || newEpisode.price==="0") newEpisode.price = "GRATIS";
                                else newEpisode.price = newEpisode.price + "€";
                                
                                await Api.updateEpisode(podcast.podcast_id, newEpisode);
                                // chiude automaticamente il modale dopo l'evento di submit
                                $('#modalModifyEpisode').modal('hide');
                                page.redirect('/' + podcast.podcast_id);
                            } catch(error) {
                                if(error) window.alert(error);   
                            }
                        }    
                    });
                });
            } else { // Se l'utente non e' il creatore del podcast
                // Html per il bottone 'Acquista'
                let rowPayButton = document.getElementById('row-pay-button');
                let buttonBuy = `<button type="button" id="button-buy" data-toggle="modal" data-target="#modalPayEpisode" 
                    class="btn btn-primary text-wrap text-light">Acquista ${episode.price}</button>`;
                // Modale per il pagamento
                rowPayButton.innerHTML = createPayEpisode();
                
                if(this.user) {
                    // Preferiti - aggiunta - eliminazione
                    // html per il bottone 'preferiti'
                    let rowFavoriteButton = document.getElementById('row-favorite-button');
                    const buttonFavorite = document.createElement('button');
                    buttonFavorite.id = "favorite" + episode.episode_id;
                    
                    let favorite = await Api.getFavorite(parseInt(localStorage.getItem('user_id')), episode.episode_id);
                    if(favorite.error === "Favorite not found.") {
                        buttonFavorite.className = "btn btn-warning color-favorite-add";
                        buttonFavorite.innerHTML = "Aggiungi ai preferiti";
                    } else {
                        buttonFavorite.className = "btn btn-danger color-favorite-remove";
                        buttonFavorite.innerHTML = "Rimuovi dai preferiti";
                    }
                    rowFavoriteButton.appendChild(buttonFavorite);

                    document.getElementById('favorite' + episode.episode_id).addEventListener('click', async () => {
                        let user_favorite_id = parseInt(localStorage.getItem("user_id"));
                        if(document.getElementById('favorite' + episode.episode_id).innerHTML === "Aggiungi ai preferiti") {
                            await Api.addFavorite(new Favorite(user_favorite_id, episode.episode_id));
                            location.reload();
                        } else {
                            await Api.deleteFavorite(user_favorite_id, episode.episode_id);
                            location.reload();
                        }
                    }); 
                }

                let buy = await Api.getBuy(parseInt(localStorage.getItem('user_id')), episode.episode_id);
                // Se l'utente ha acquistato l'episodio lo rendo disponbile per la riproduzione
                if(buy.error !== 'Buy not found.') {
                    document.getElementById("player").src = '/audio/' + episode.audio;
                    rowPayButton.insertAdjacentHTML('afterbegin', `Acquistato!`);
                }
                if(episode.price === 'GRATIS') rowPayButton.insertAdjacentHTML('afterbegin', `GRATIS`);
                // Se l'untente e' loggato, l'episodio e' a pagamento e NON e' stato comprato 
                // viene inserito il bottone per acquistare
                if(this.user && (episode.price !== 'GRATIS' && buy.error === 'Buy not found.')) {
                    rowPayButton.insertAdjacentHTML('afterbegin', buttonBuy);
                    
                    document.getElementById('button-buy').addEventListener('click', () => {
                        // Evento di submit per il pagamento
                        document.getElementById('pay-form').addEventListener('submit', async () => {
                            // event deprecato -> vedi README.txt
                            event.preventDefault();
                            await Api.addBuyEpisode(new Buy(parseInt(localStorage.getItem('user_id')), episode.episode_id));
                            // chiude automaticamente il modale dopo l'evento di submit
                            $('#modalPayEpisode').modal('hide');
                            location.reload();
                        });
                    });
                } 
            }
        }
    }

    // Visualizzo a schermo i podcast seguiti dell'utente
    showFollow() {
        // Evento di click per la visuazione dei follow
        document.getElementById('followed').addEventListener('click', () => {
            if(this.user) {
                this.clearPodcast();
                this.getUserById(localStorage.getItem('user_id')).then(user => {
                    //this.showDataUser(user);
                    this.getFollowProfile(user.user_id).then(podcast => {
                        this.showPodcast(podcast);
                        this.clickPodcast();
                    });
                });
            } else window.alert("Iscriviti o entra nel sito!");
        });
    }

    // Visualizzo a schermo gli episodi preferiti dell'utente
    showFavorite() {
        // Evento di click per la visuazione dei preferiti
        document.getElementById('fav').addEventListener('click', () => {
            if(this.user) {
                this.clearPodcast();
                this.getUserById(localStorage.getItem('user_id')).then(user => {
                    this.getFavoriteProfile(user.user_id).then(episode => {
                        this.getAllPodcast().then(podcast => {
                            this.showEpisodeFavoriteSearch(episode, podcast);
                        });
                    });
                });
            } else window.alert("Iscriviti o entra nel sito!");
        });
    }

    // Funzione usata per visualizzare gli episodi 'preferiti'
    showEpisodeFavoriteSearch = async (episode, podcast) => {
        this.podcastContainer.innerHTML =  `<table class="col table table-hover table-borderless size-text-table size-table-episode">
                                                <thead></thead>
                                                <tbody id="my-episode-detail"> 
                                                </tbody>
                                            </table>`;
        for(let ep of episode) {
            if(ep.sponsor===null || ep.sponsor==="") ep.sponsor = "";
            if(ep.price===null || ep.price==="€" || ep.price==="0€") ep.price = "GRATIS";
            else ep.price = ep.price;

            const detailEpisodeTable = document.querySelector('#my-episode-detail');
            const episodeRow = createEpisodeRow(ep);
            detailEpisodeTable.insertAdjacentHTML('afterbegin', episodeRow);

            if(ep.price === 'GRATIS' || ep.price === '€' || parseInt(localStorage.getItem('user_id')) === podcast.user_id)
                document.getElementById("player").src = '/audio/' + ep.audio;

            let rowPayButton = document.getElementById('row-pay-button');
            let buy = await Api.getBuy(parseInt(localStorage.getItem('user_id')), ep.episode_id);

            if(buy.error !== 'Buy not found.') {
                document.getElementById("player").src = '/audio/' + ep.audio;
                rowPayButton.insertAdjacentHTML('afterbegin', `Acquistato a soli`);
            }
        }
    }

    // Visualizzo dati dell'utente loggato
    showDataUser(id) {
        this.getUserById(id).then(u => {
            this.containerDataUser.innerHTML = createShowDataUser(u);
        });
    }

    // Ricerca
    search() {
        // L'evento keyup si verifica quando viene premuto un tasto della tastiera nella barra di ricerca
        document.getElementById('searchbar').addEventListener("keyup", e => {
            if(document.getElementById("check-episode").checked) {
                // La variabile 'e' conterra' cio' che viene digitato
                let string = e.target.value.toLowerCase();
                // Carico gli episodi
                this.getAllEpisode().then(episode => {
                    if(this.clearPodcast !== '') this.clearPodcast();
                    episode = episode.filter(e => {
                        return ( 
                            e.name.toLowerCase().includes(string) || 
                            e.description.toLowerCase().includes(string) 
                        );    
                    });
                    this.getAllPodcast().then(podcast => {
                        this.showEpisodeFavoriteSearch(episode, podcast);
                    });
                });
            } else {
                // La variabile 'e' conterra' cio' che viene digitato
                let string = e.target.value.toLowerCase();
                // Carico i Podcast
                this.getAllPodcast().then(podcast => {
                    if(this.clearPodcast !== '') this.clearPodcast();
                    // Ritorno una stringa per titolo o autore dentro l'oggetto 'podcast'
                    podcast = podcast.filter(p => {
                        return (
                            p.title.toLowerCase().includes(string) ||
                            p.author.toLowerCase().includes(string)
                        );    
                    });
                    // Sisualizzo il/i podcast appena ricercato/i
                    this.showPodcast(podcast);
                    this.clickPodcast();
                });
            }
        });
    }

    // Podcast - Aggiunta - Modifica - Eliminazione
    
    // Aggiunta podcast
    onAddPodcastSubmitted = async (event) => {
        event.preventDefault();
        const form = event.target;
        if(form.checkValidity()) {
            try {
                const podcast = {
                    image: form.image.value,
                    author: this.user.username,
                    title: form.title.value,
                    description: form.description.value,
                    category: form.category.value,
                    user_id: this.user.user_id
                }
                if(podcast.category === 'Categoria') window.alert("Inserire una categoria");
                else {
                    await Api.addPodcast(podcast);
                    form.reset();
                    // chiude automaticamente il modale dopo l'evento di submit
                    $('#modalAddPodcast').modal('hide');
                    page.redirect('/');
                }
            } catch(error) {
                if(error) window.alert(error);
            }
        }
    }

    // Modifica podcast
    onModifyPodcastSubmitted = async (event) => {
        event.preventDefault();
        const form = event.target;
        if(form.checkValidity()) {
            try {
                const podcast = {
                    image: form.image.value,
                    author: this.user.username,
                    title: form.title.value,
                    description: form.description.value,
                    category: form.category.value,
                    user_id: this.user.user_id,
                }
                let loc = window.location.href; 
                let id = loc.substr(loc.lastIndexOf('/') + 1);
                await Api.updatePodcast(id, podcast);
                // chiude automaticamente il modale dopo l'evento di submit
                $('#modalModifyPodcast').modal('hide');
                form.reset();
                page.redirect('/' + id);
            } catch(error) {
                if(error) {
                    window.alert(error);  
                }
            }
        } 
    }

    // Cancellazione podcast
    onDeletePodcast = async () => {
        if(window.confirm('Confermi di voler cancellare il podcast?' )) {
            let loc = window.location.href; 
            let id = loc.substr(loc.lastIndexOf('/') + 1);
            await Api.deletePodcast(id);
            document.getElementById('category').removeAttribute('disabled');
            page.redirect('/');
        }
    }

    // Episodi - Aggiunta - Eliminazione

    // Aggiunta episodio
    onAddEpisodeSubmitted = async (event) => {
        event.preventDefault();
        const form = event.target;
        let loc = window.location.href; 
        let pod_id = loc.substr(loc.lastIndexOf('/') + 1);

        if(form.checkValidity()) {
            try {
                const episode = {
                    name: form.name.value,
                    audio: form.audio.value,
                    description: form.description.value,
                    date: moment().format('YYYY-MM-DD'),
                    sponsor: form.sponsor.value,
                    price: form.price.value + '€',
                    podcast_id: pod_id
                }
                await Api.addEpisode(episode);
                // chiude automaticamente il modale dopo l'evento di submit
                $('#modalAddEpisode').modal('hide');
                form.reset();
                page.redirect('/' + episode.podcast_id);
            } catch(error) {
                if(error) {
                    window.alert(error);  
                }
            }
        }
    }

    // Cancellazione episodio
    onDeleteEpisode = async (episode_id) => {
        if(window.confirm("Confermi di voler cancellare l'episodio?")) {
            await Api.deleteEpisode(episode_id);
            location.reload();
        }
    }

    // Login
    onLoginSubmitted = async (event) => {
        event.preventDefault();
        const form = event.target;

        if(form.checkValidity()) {
            try {
                // all'Api viene passata l'email e la password (entrambe recuperate dal form)
                this.user = await Api.doLogin(form.email.value, form.password.value);
                const user = this.user;

                // salva nel localstorage
                localStorage.setItem('user_id', this.user.user_id);
                localStorage.setItem('username', this.user.username);
                this.userLogged(user);
                window.alert(`Welcome ${user.username}!`);

                // chiude automaticamente il modale dopo l'evento di submit
                $('#modalLogin').modal('hide');
                document.getElementById('data-user').removeAttribute('disabled');
                document.getElementById('category').removeAttribute('disabled');
                location.reload();
            } catch(error) {
                console.log(error);
                window.alert("E-mail o password errati");
            }
        }
    }

    // Signin
    onSignInSubmitted = async (event) => {
        event.preventDefault();
        const form = event.target;
        if (form.checkValidity()) {
            try {
                const user = {
                    username: form.username.value,
                    email: form.email.value,
                    password: form.password.value,
                    creator: form.creator.checked
                }
                await Api.createUser(user);
                window.alert("Registrazione effettuata con successo!");
                // chiude automaticamente il modale dopo l'evento di submit
                $('#modalSignIn').modal('hide');
                location.reload();
            } catch (error) {
                if (error) window.alert(error);
            }
        }
    }

    userLogged = async (user) => {
        // rendo visibile il link per il logout
        this.logOutLink.classList.remove('invisible');
        // rendo invisibile i link 'accedi' e 'iscriviti'
        document.querySelectorAll('.logged').forEach(el => {
            el.classList.add('invisible');
        });
        const us = await Api.getUserById(user.user_id);
        if(us.creator === 1) {
            document.querySelectorAll('.creator').forEach(el => {
                el.classList.remove('invisible');
            });
        }
    }

    // Logout
    logOut = async () => {
        await Api.doLogout();
        this.user = null;
        localStorage.removeItem('user_id');
        localStorage.removeItem('username');
        localStorage.clear();
        this.logOutLink.classList.add('invisible');
        
        document.querySelectorAll('.logged').forEach(el => {
            el.classList.remove('invisible');
        });
        document.querySelectorAll('.creator').forEach(el => {
            el.classList.add('invisible');
        });

        document.getElementById('data-user').setAttribute('disabled', true);
        document.getElementById('category').removeAttribute('disabled');
    }

    // Get from Api.js

    getAllEpisodeFromPodcast = async (id) => {
        return await Api.getAllEpisodeFromPodcast(id);
    }

    getEpisodeFromPodcastId = async (pod_id, ep_id) => {
        return await Api.getEpisodeFromPodcastId(pod_id, ep_id);
    }

    getPodcastId = async (id) => {
        return await Api.getPodcastId(id);
    }

    getAllPodcast = async () => {
        return await Api.getAllPodcast();
    }

    getComment = async () => {
        return await Api.getComment();
    }

    getUserById = async (user_id) => {
        return await Api.getUserById(user_id);
    }

    getFollowProfile = async (user_id) => {
        return await Api.getFollowProfile(user_id);
    }

    getFavoriteProfile = async (user_id) => {
        return await Api.getFavoriteProfile(user_id);
    }

    getAllEpisode = async () => {
        return await Api.getAllEpisode();
    }

    clearPodcast() {
        this.podcastContainer.innerHTML = '';
    }

    // Evento di click su un podcast
    clickPodcast() {
        this.podcastContainer.querySelectorAll('img').forEach(link => {
            // Evento di click per la visualizzazione dei dettagli del podcast e dei relativi episodi
            link.addEventListener('click', this.openPodcastID);
        });
    }

    // Apre la pagina del podcast cliccato
    openPodcastID() {
        location.href = '/' + this.id;
    }

    filterAction() {
        document.addEventListener('category-selected', this.onCategorySelected);
    }
}

export default App;