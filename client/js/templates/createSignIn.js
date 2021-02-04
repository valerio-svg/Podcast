function createSignIn() {
    return `<div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Inserisci le credenziali</h5>
                        <!-- Bottone 'X' per chiudere -->
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    
                    <div class="modal-body">
                        <!-- Campi da compilare -->
                        <form method="POST" action="" id="signin-form" class="container">
                            <div class="form-group">
                                <input type="text" name="username" class="form-control" placeholder="Username" required>
                            </div>
                            <div class="form-group">
                                <input type="email" name="email" class="form-control" placeholder="Email" required>
                            </div>
                            <div class="form-group">
                                <input type="password" required pattern=".{6,}" name="password" class="form-control" placeholder="Password (minimo 6 caratteri)" autocomplete="on" required>
                            </div>
                            <div class="form-group form-check">
                                <input type="checkbox" name="creator" class="form-check-input" id="check">
                                <label class="form-check-label" for="check">Creatore</label>
                            </div>
                            <button type="submit" class="btn btn-primary button">Iscriviti</button>

                        </form>
                    </div>
                </div>
            </div>`;
}

export {createSignIn};