function createModifyEpisode() {
    return `<!-- Pop-up per la modifica degli episodi -->
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
    </div>`;
}

export { createModifyEpisode };