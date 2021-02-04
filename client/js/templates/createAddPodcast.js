function createAddPodcast() {
    return `<div class="modal-dialog">
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
                        <form method="POST" action="" id="addPodcast-form" class="container">
                            <div class="form-group">
                                <label for="text" class="col-form-label">Titolo</label>
                                <input type="text" maxlength="50" name="title" class="form-control" required>
                            </div>

                            <div class="dropdown-menu" id="my-dropdown-category">
                            <a data-id="All" class="dropdown-item" href="">Tutti</a>
                            <div class="dropdown-divider"></div> <!-- Linea di divisione tra le categorie -->
                            <a data-id="Tecnologia" class="dropdown-item" href="">Tecnologia</a>
                            <a data-id="Storia" class="dropdown-item" href="">Storia</a>
                            <a data-id="Musica" class="dropdown-item" href="">Musica</a>
                            <a data-id="Cinema" class="dropdown-item" href="">Cinema</a>
                            <a data-id="Sport" class="dropdown-item" href="">Sport</a>
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
                                <textarea type="text" maxlength="150" name="description" class="form-control" autocomplete="on" required> </textarea>
                            </div>
                            
                            <div class="form-group">
                                <select name="category" class="form-control">
                                    <option selected>Categoria</option>
                                    <option>Tecnologia</option>
                                    <option>Storia</option>
                                    <option>Musica</option>
                                    <option>Cinema</option>
                                    <option>Sport</option>
                                </select>
                            </div>
                            
                            <button type="submit" class="btn btn-primary button">Conferma</button>
                        </form>
                    </div>
                </div>
            </div>`
}

export {createAddPodcast};