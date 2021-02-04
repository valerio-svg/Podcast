function createPayEpisode() {
    return `
        <!-- Pop-up per il pagamento degli episodi -->
        <div class="modal fade color-text-modal" id="modalPayEpisode" tabindex="-1" role="dialog" aria-labelledby="modalLabelPayEpisode" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Compila i seguenti campi per acquistare</h5>
                        <!-- Bottone 'X' per chiudere -->
                        <button type="button" class="close" data-dismiss="modal" id="close-modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                        
                    <div class="modal-body">
                        <!-- Campi da compilare -->
                        <form method="POST" action="" id="pay-form" class="container">
                            <div class="form-group">
                                <input type="text" pattern='[0-9]{16}' class="form-control" placeholder="Carta di credito (16 cifre)" required>
                            </div>

                            <div class="row">
                                <div class="col">
                                    <select name="Mese" class="form-control">
                                        <option value="january">Gennaio</option>
                                        <option value="february">Febbraio</option>
                                        <option value="march">Marzo</option>
                                        <option value="april">Aprile</option>
                                        <option value="may">Maggio</option>
                                        <option value="june">Giugno</option>
                                        <option value="july">Luglio</option>
                                        <option value="august">Agosto</option>
                                        <option value="september">Settembrer</option>
                                        <option value="october">Ottobre</option>
                                        <option value="november">Novembre</option>
                                        <option value="december">Dicembre</option>
                                    </select>
                                </div>
                                <div class="col">
                                    <select name="Anno" class="form-control">
                                        <option value="2021">2021</option>
                                        <option value="2022">2022</option>
                                        <option value="2023">2023</option>
                                        <option value="2024">2024</option>
                                    </select>
                                </div>
                                <div class="col">
                                    <input type="text" pattern='[0-9]{3}' class="form-control" placeholder="CVV (3 cifre)" required>
                                </div>
                            </div>
                            
                            <div class="pos-button-pay">
                                <button type="submit" class="btn btn-primary button">Conferma</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>`;
}

export { createPayEpisode };