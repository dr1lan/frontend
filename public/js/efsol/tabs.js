(function($){ $.fn.addTabs = function(options){
		 var defaults = {
		 
			method:"image",             //image - загружает в основное фото картинку указанную в href ссылки, оборачивающей маленькое фото товара; id - загружает JSON по указанном уурлу и на основе полученного массива обновляет данные страницы
			activeClass:"tab-active",
			activeTabClass:"jshover"
		 };		
				 var options = $.extend(defaults, options);
			
				 return this.each(function(index) {
				 		
				 			var $this = $(this);
				 			$this.click(function() {
				 				var tab_id = $this.attr("href");
				 				
				 			    $('.'+options.activeClass)
				 			    	.removeClass(options.activeClass)
				 			    	.hide();
				 			    $('.'+options.activeTabClass)
				 			    	.removeClass(options.activeTabClass)	
				 			    	
				 			    $this.parent().addClass('jshover');	
				 			    
				 				$(tab_id)
				 					.show()
				 					.addClass(options.activeClass);
                                                            return false;
				 			});
						
					
				 });
}})(jQuery);
