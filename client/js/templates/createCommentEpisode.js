function createCommentEpisode() {
    return `<!-- Pop-up per i commenti -->
            <div class="modal fade color-text-modal" id="modalCommentEpisode" tabindex="-1" role="dialog" aria-labelledby="modalLabelCommentEpisode" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 id="title" class="modal-title"></h5>
                            <!-- Bottone 'X' per chiudere -->
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        
                        <p class="text-comment pos-text-comment">I commenti che crei puoi modificarli cliccando su essi.</p>
                        <p class="text-comment">Per confermare la modifica clicca "Invio".</p>

                        <div id="all-comment" class="list-group container modal-body">
                            
                        </div>
                    </div>
                </div>
            </div>`;
}

export { createCommentEpisode };