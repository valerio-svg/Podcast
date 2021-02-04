function createShowDataUser(user) {
    return `<div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 id="user-title" class="modal-title data-user-creator">${user.creator === 1 ? `Utente Creatore` : `Utente Ascoltatore`}</h5>
                        <!-- Bottone 'X' per chiudere -->
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    
                    <div class="modal-body">
                        <a class="data-user">Ciao ${user.username}!<br>Ti sei iscritto con la mail: ${user.email}</a>
                    </div>
                </div>
            </div>`;
}

export { createShowDataUser};