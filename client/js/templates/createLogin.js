function createLogin() {
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
                        <form method="POST" action="" id="login-form" class="container">
                            <div class="form-group">
                                <input type="email" name="email" class="form-control" placeholder="Email" required>
                            </div>
                            
                            <div class="form-group">
                                <input type="password" name="password" min=6 class="form-control" placeholder="Password" autocomplete="on" required>
                            </div>
                            <button type="submit" class="btn btn-primary button">Entra</button>
                        </form>
                    </div>
                </div>
            </div>`;
}

export {createLogin};