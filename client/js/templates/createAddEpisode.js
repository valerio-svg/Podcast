function createAddEpisode() {
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
                        <form method="POST" action="" id="addEpisode-form" class="container">
                            <div class="form-group">
                                <label for="text" class="col-form-label">Nome</label>
                                <input type="text" maxlength="35" name="name" class="form-control" required>
                            </div>

                            <div class="form-group">
                                <label for="text" class="col-form-label">Audio</label>
                                <input type="text" name="audio" placeholder="esempio: audio.mp3" class="form-control" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="textarea" class="col-form-label">Descrizione</label>
                                <textarea type="text" maxlength="100" name="description" class="form-control" autocomplete="on" required></textarea>
                            </div>
                            
                            <div class="form-group">
                                <label for="input" class="col-form-label">Sponsor</label>
                                <input type="text" maxlength="20" name="sponsor" class="form-control" autocomplete="on">
                            </div>

                            <div class="form-group">
                                <label for="input" class="col-form-label">Prezzo</label>
                                <input type="number" max="9999" name="price" class="form-control" autocomplete="on">
                            </div>
                            
                            <button type="submit" pattern='[0-9]{4}' class="btn btn-primary button">Conferma</button>
                        </form>
                    </div>
                </div>
            </div>`
}

export {createAddEpisode};