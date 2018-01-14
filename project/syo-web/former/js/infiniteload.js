jQuery(document).ready(function($){
								
	$( pix_infiniteload.contentSelector ).infiniteLoad({
			'navSelector':pix_infiniteload.navSelector,
			'contentSelector':pix_infiniteload.contentSelector,
			'nextSelector':pix_infiniteload.nextSelector,
			'itemSelector':pix_infiniteload.itemSelector,
			'paginationType':pix_infiniteload.paginationType,
			'loadingImage':pix_infiniteload.loadingImage,
			'loadingButtonLabel':pix_infiniteload.loadingButtonLabel,
			'loadingButtonClass':pix_infiniteload.loadingButtonClass,
			'loadingFinishedText':pix_infiniteload.loadingFinishedText,
		}								  
	);
								
});