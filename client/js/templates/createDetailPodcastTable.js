function createDetailPodcastTable(podcast) {
    return `<!-- Dettagli del podcast -->
            <div class="media">
                <img src="/images/${podcast.image}" 
                    class="size-img-podcast" alt="img">     
                
                <!-- Table-bordeless elmina i bordi dalla tabella --> 
                <table class="table size-text-table table-borderless">
                    <thead class="custom-text">
                        <th scope="col">Autore</th>
                        <th scope="col">Titolo</th>
                        <th scope="col">Descrizione</th>
                        <th scope="col">Categoria</th>
                        <th scope="col"></th>
                    </thead>

                    <tbody id="my-podcast-detail">
                        
                    </tbody>
                </table>
            </div>            

            <div id="row-follow-button" class="pos-div-follow-unfollow">
                
            </div>

            <!-- Tabella con la lista degli episodi -->
            <table class="col table table-hover table-borderless size-text-table size-table-episode">
                <thead></thead>
                <tbody id="my-episode-detail">
                        
                </tbody>
            </table>`;
}

function createPodcastRow(podcast) {
    return `<tr class="table-podcast custom-text2">
                <td class="td-author">${podcast.author}</td>
                <td class="td-title-pod">${podcast.title}</td>
                <td class="td-description-pod">${podcast.description}</td>
                <td class="td-category-pod">${podcast.category}</td>
                <td class="td-delete-mofidy-pod">
                    <button id="deletePodcastButton" type="button" 
                        class="btn btn-danger pos-button-delete-podcast invisible podcastUser">Elimina Podcast</button>
                            
                    <button data-toggle="modal" data-target="#modalModifyPodcast" 
                        type="button" class="btn btn-warning invisible podcastUser">Modifica Podcast</button>       

                    <!-- Pop-up per la modifica dei podcast -->
                    <div class="modal fade color-text-modal" id="modalModifyPodcast" tabindex="-1" role="dialog" aria-labelledby="modalLabelModifyPodcast" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">Compila i seguenti campi</h5>
                                    <!-- Bottone 'X' per chiudere -->
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                
                                <div class="modal-body">
                                    <!-- Campi da compilare -->
                                    <form method="PUT" action="" id="modifyPodcast-form" class="container">
                                        <div class="form-group" >
                                            <label for="text" class="col-form-label">Titolo</label>
                                            <input value="${podcast.title}" name="title" maxlength="50" type="text" class="form-control" required>
                                        </div>

                                        <div class="form-group">
                                            <label for="text" class="col-form-label">Immagine</label>
                                            <select name="image" class="form-control">
                                                <option>default.jpg</option>
                                                <option>Cinema.jpg</option>
                                                <option>retro.jpg</option>
                                                <option>IA.jpg</option>
                                                <option>info.jpg</option>
                                                <option>metallica.jpg</option>
                                                <option>serieA.jpg</option>
                                                <option>tarantino.jpg</option>
                                                <option>zelda.jpeg</option>
                                            </select>
                                        </div>
                                        
                                        <div class="form-group">
                                            <label for="textarea" class="col-form-label">Descrizione</label>
                                            <textarea name="description" maxlength="100" type="text" class="form-control" autocomplete="on" required>${podcast.description}</textarea>
                                        </div>
                                        
                                        <div class="form-group">
                                            <select name='category' class="form-control">
                                                <option name="category">Tecnologia</option>
                                                <option name="category">Storia</option>
                                                <option name="category">Musica</option>
                                                <option name="category">Cinema</option>
                                                <option name="category">Sport</option>
                                            </select>
                                        </div>
                                        
                                        <button type="submit" class="btn btn-warning button">Conferma</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>`;
}

function createEpisodeRow(episode) {
    return `<tr id="${episode.episode_id}" class="table-episode">
                <td class="td-episode-name">
                    ${episode.name}
                </td>
                <td class="td-player">
                    <audio controls id="player" type="audio/mp3"> </audio>
                </td>
                <td class="td-description">
                    ${episode.description}
                </td>
                <td class="td-date">
                    ${episode.date}
                </td>
                <td class="td-sponsor">
                    ${episode.sponsor}
                </td>
                <td class="td-price" id="row-pay-button">
                    ${episode.price}
                </td>
                <td class="td-comment" id="row-comment-button">
                    
                </td>
                <td id="row-favorite-button">
                    
                </td>
                <td>
                    <button id="modifyEpisodeButton" data-toggle="modal" data-target="#modalModifyEpisode" 
                        type="button" class="btn btn-warning invisible episodeUser">Modifica</button>
                    
                    <button id="deleteEpisodeButton" type="button" 
                        class="btn btn-danger invisible episodeUser">Elimina</button>    
                    
                    <!-- Pop-up per la modifica degli episodi -->
                    <div class="modal fade color-text-modal" id="modalModifyEpisode" tabindex="-1" role="dialog" aria-labelledby="modalLabelModifyEpisode" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">Compila i seguenti campi</h5>
                                    <!-- Bottone 'X' per chiudere -->
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                    
                                <div class="modal-body">
                                    <!-- Campi da compilare -->
                                    <form method="PUT" action="" id="modifyEpisode-form" class="container">
                                        <div class="form-group">
                                            <label for="text" class="col-form-label">Titolo</label>
                                            <input name="title" type="text" maxlength="35" class="form-control" required>
                                        </div>
    
                                        <div class="form-group">
                                            <label for="text" class="col-form-label">Audio</label>
                                            <input name="audio" type="text" placeholder="esempio: audio.mp3" class="form-control" required>
                                        </div>
                                            
                                        <div class="form-group">
                                            <label for="textarea" class="col-form-label">Descrizione</label>
                                            <textarea name="description" maxlength="100" type="text" class="form-control" autocomplete="on" required></textarea>
                                        </div>

                                        <div class="form-group">
                                            <label for="input" class="col-form-label">Sponsor</label>
                                            <input name="sponsor" maxlength="20" type="text" class="form-control" autocomplete="on">
                                        </div>

                                        <div class="form-group">
                                            <label for="input" class="col-form-label">Prezzo</label>
                                            <input type="number" max="9999" name="price" class="form-control" autocomplete="on">
                                        </div>
                                            
                                        <button type="submit" class="btn btn-warning button">Conferma</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>           
                </td>
            </tr>`;
}

export { createDetailPodcastTable, createPodcastRow, createEpisodeRow  };