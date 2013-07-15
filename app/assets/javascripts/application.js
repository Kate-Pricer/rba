// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs 
//= require bootstrap
//= require jquery.dataTables
//= require_self



(function($) {

		$.fn.replaceDropdown = function(method) {

			var methods = {
				init: function(options) {
					var self = this;
					// Merge default & user-provided properties
					self.replaceDropdown.settings = $.extend({}, self.replaceDropdown.defaults, options);

					// iterate through all the DOM elements we are attaching the plugin to
					return self.each(function() {

						var $element = $(this),  // reference to the jQuery version of the current DOM element
							element = this,      // reference to the actual DOM element
							elementID = this.id, // reference to the element ID
							divID = elementID + self.replaceDropdown.settings.divIDtext, // reference to the new div ID
							ddTimer, // timer variable
							$openDiv = $("#" + divID); // cache the reference to the divID jQuery object

						self.replaceDropdown.settings.linkText = self.replaceDropdown.settings.linkText || $element.find("option").eq(0).text();
						divID = helpers.buildDropdown($element, element, self);
						//$element.css({ position: "absolute", left: "-99999px" });

						// Setup Click event for dropdown
						helpers.initEvents(divID, self);

					});

				}
			};
			// private methods
			var helpers = {
				initEvents: function(divID, self) {
					helpers.setEventsForDropdown(divID, self);
					helpers.assignDropdownLinkEvents(self);
					helpers.closeDropdown(divID);
				},
				buildDropdown: function($element, element, self) {
					// Replace Dropdown code 
					var divID = element.id + self.replaceDropdown.settings.divIDtext;
					var linkID = element.id + self.replaceDropdown.settings.linkIDtext;
					var $prodOptions = $element.find("option");
					var prodList = '<div id="' + divID + '" class="' + self.replaceDropdown.settings.ddClass + '">\n<a href="#" id="' + linkID + '">' + self.replaceDropdown.settings.linkText + '</a>\n<ul>\n';
					for (var i = 0; i < $prodOptions.length; i++) {
						prodList += '<li><a href="' + $prodOptions.eq(i).text() + '" rel="' + $prodOptions.eq(i).val() + '">' + $prodOptions.eq(i).text() + '</a></li>\n';
					}
					prodList += '</ul>\n</div>\n';

					$element.next("button").remove();
					$element.after(prodList);

					return divID;
				},
				setEventsForDropdown: function(divID, self) {
					var $openDiv = $("#" + divID);
					$openDiv.unbind().click(function(e) {
						e.preventDefault();
						e.stopPropagation();
						var theID = $openDiv.attr("id");
						$(".dropdown.open:not('#" + theID + "')").each(function() {
							helpers.closeDropdown(this.id); // close any exisiting open dropdowns
						});
						if ($(this).hasClass("open") == false && $(this).hasClass("disabled") == false) {
							var index = $(this).find("a.selected").parent().index();
							var topOffset = 25 * index;
							if (self.replaceDropdown.settings.flipTop) {
								helpers.flipDropdown(this, self);
							}
							$thisUL = $(this).find("ul");
							$thisUL.scrollTop(topOffset);
							$thisUL.css({ "visibility": "visible" });
							$thisUL.slideDown("fast");
							$(this).addClass("open");
							$("body").click(function(e) {
								$("body").unbind();
								helpers.closeDropdown(divID);
							});
						} else {
							helpers.closeDropdown(divID);
							$("body").unbind();
						}
					});
				},
				assignDropdownLinkEvents: function(self) {
					$("." + self.replaceDropdown.settings.ddClass + " ul li a").bind("click", function(e) {
						e.preventDefault();
						var selectID = $(this).parents("." + self.replaceDropdown.settings.ddClass).attr("id").replace(self.replaceDropdown.settings.divIDtext, "");
						var $select = $("#" + selectID);
						$select.children("option").attr("selected", "");
						$select.children("option").eq($(this).parent().index()).attr("selected", "selected");
						$("." + self.replaceDropdown.settings.ddClass + " ul").slideUp("fast");
						$(this).parents("." + self.replaceDropdown.settings.ddClass).find("#" + selectID + self.replaceDropdown.settings.linkIDtext).text($(this).text());
						$select.change();
					});
				},
				closeDropdown: function(divID) {
					var $openDiv = $("#" + divID);
					if ($openDiv.hasClass("open")) {
						$openDiv.children("ul").css({ "visibility": "hidden" });
						$openDiv.removeClass("open");
						$openDiv.find("a").blur();
					}
				},
				flipDropdown: function(item, self) {
					$(item).find("ul").removeClass("showTop");
					var offsetTop = $(item).find("ul").offset().top;
					var tabOffsetTop = $(item).parents(self.replaceDropdown.settings.parent).length ? $(item).parents(self.replaceDropdown.settings.parent).offset().top : 0;
					var ddHeight = $(item).find("ul").height() * 1 + 6;
					var windowHeight = $(window).height() * 1;
					if (((windowHeight - offsetTop) < ddHeight) && ((offsetTop - tabOffsetTop) > ddHeight)) {
						$(item).find("ul").addClass("showTop");
					}
				}
			};

			// if a method as the given argument exists
			if (methods[method]) {
				// call the respective method
				return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
				// if an object is given as method OR nothing is given as argument
			} else if (typeof method === 'object' || !method) {
				// call the initialization method
				return methods.init.apply(this, arguments);
				// otherwise
			} else {
				// trigger an error
				$.error('Method "' + method + '" does not exist in replaceDropdown plugin!');
			};
		};

		// default options
		$.fn.replaceDropdown.defaults = {
			divIDtext: "LinkList",
			linkIDtext: "Link",
			linkText: "",
			parent: "", // required for flipTop
			flipTop: false,
			ddClass: "ddlist"
		};
		// this will hold the merged default and user-provided options
		$.fn.replaceDropdown.settings = {};
	})(jQuery);

	$(function(){
		$("#tselect").replaceDropdown();
		$("#bselect").replaceDropdown();
		$("#cselect").replaceDropdown();
		$("#dselect").replaceDropdown();
		$("#fselect").replaceDropdown();
		$("#aselect").replaceDropdown();
		$("#gselect").replaceDropdown();
		$("#rselect").replaceDropdown();
	});


/* Set the defaults for DataTables initialisation */
$.extend( true, $.fn.dataTable.defaults, {
	"sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
	"sPaginationType": "bootstrap",
	"oLanguage": {
		"sLengthMenu": "_MENU_ records per page"
	}
} );


/* Default class modification */
$.extend( $.fn.dataTableExt.oStdClasses, {
	"sWrapper": "dataTables_wrapper form-inline"
} );


/* API method to get paging information */
$.fn.dataTableExt.oApi.fnPagingInfo = function ( oSettings )
{
	return {
		"iStart":         oSettings._iDisplayStart,
		"iEnd":           oSettings.fnDisplayEnd(),
		"iLength":        oSettings._iDisplayLength,
		"iTotal":         oSettings.fnRecordsTotal(),
		"iFilteredTotal": oSettings.fnRecordsDisplay(),
		"iPage":          oSettings._iDisplayLength === -1 ?
			0 : Math.ceil( oSettings._iDisplayStart / oSettings._iDisplayLength ),
		"iTotalPages":    oSettings._iDisplayLength === -1 ?
			0 : Math.ceil( oSettings.fnRecordsDisplay() / oSettings._iDisplayLength )
	};
};


/* Bootstrap style pagination control */
$.extend( $.fn.dataTableExt.oPagination, {
	"bootstrap": {
		"fnInit": function( oSettings, nPaging, fnDraw ) {
			var oLang = oSettings.oLanguage.oPaginate;
			var fnClickHandler = function ( e ) {
				e.preventDefault();
				if ( oSettings.oApi._fnPageChange(oSettings, e.data.action) ) {
					fnDraw( oSettings );
				}
			};

			$(nPaging).addClass('pagination').append(
				'<ul>'+
					'<li class="prev disabled"><a href="#">&larr; '+oLang.sPrevious+'</a></li>'+
					'<li class="next disabled"><a href="#">'+oLang.sNext+' &rarr; </a></li>'+
				'</ul>'
			);
			var els = $('a', nPaging);
			$(els[0]).bind( 'click.DT', { action: "previous" }, fnClickHandler );
			$(els[1]).bind( 'click.DT', { action: "next" }, fnClickHandler );
		},

		"fnUpdate": function ( oSettings, fnDraw ) {
			var iListLength = 5;
			var oPaging = oSettings.oInstance.fnPagingInfo();
			var an = oSettings.aanFeatures.p;
			var i, ien, j, sClass, iStart, iEnd, iHalf=Math.floor(iListLength/2);

			if ( oPaging.iTotalPages < iListLength) {
				iStart = 1;
				iEnd = oPaging.iTotalPages;
			}
			else if ( oPaging.iPage <= iHalf ) {
				iStart = 1;
				iEnd = iListLength;
			} else if ( oPaging.iPage >= (oPaging.iTotalPages-iHalf) ) {
				iStart = oPaging.iTotalPages - iListLength + 1;
				iEnd = oPaging.iTotalPages;
			} else {
				iStart = oPaging.iPage - iHalf + 1;
				iEnd = iStart + iListLength - 1;
			}

			for ( i=0, ien=an.length ; i<ien ; i++ ) {
				// Remove the middle elements
				$('li:gt(0)', an[i]).filter(':not(:last)').remove();

				// Add the new list items and their event handlers
				for ( j=iStart ; j<=iEnd ; j++ ) {
					sClass = (j==oPaging.iPage+1) ? 'class="active"' : '';
					$('<li '+sClass+'><a href="#">'+j+'</a></li>')
						.insertBefore( $('li:last', an[i])[0] )
						.bind('click', function (e) {
							e.preventDefault();
							oSettings._iDisplayStart = (parseInt($('a', this).text(),10)-1) * oPaging.iLength;
							fnDraw( oSettings );
						} );
				}

				// Add / remove disabled classes from the static elements
				if ( oPaging.iPage === 0 ) {
					$('li:first', an[i]).addClass('disabled');
				} else {
					$('li:first', an[i]).removeClass('disabled');
				}

				if ( oPaging.iPage === oPaging.iTotalPages-1 || oPaging.iTotalPages === 0 ) {
					$('li:last', an[i]).addClass('disabled');
				} else {
					$('li:last', an[i]).removeClass('disabled');
				}
			}
		}
	}
} );


/*
 * TableTools Bootstrap compatibility
 * Required TableTools 2.1+
 */
if ( $.fn.DataTable.TableTools ) {
	// Set the classes that TableTools uses to something suitable for Bootstrap
	$.extend( true, $.fn.DataTable.TableTools.classes, {
		"container": "DTTT btn-group",
		"buttons": {
			"normal": "btn",
			"disabled": "disabled"
		},
		"collection": {
			"container": "DTTT_dropdown dropdown-menu",
			"buttons": {
				"normal": "",
				"disabled": "disabled"
			}
		},
		"print": {
			"info": "DTTT_print_info modal"
		},
		"select": {
			"row": "active"
		}
	} );

	// Have the collection use a bootstrap compatible dropdown
	$.extend( true, $.fn.DataTable.TableTools.DEFAULTS.oTags, {
		"collection": {
			"container": "ul",
			"button": "li",
			"liner": "a"
		}
	} );
}


/* Table initialisation */
$(document).ready(function() {
	$('#example').dataTable( {
		"sDom": "<'row'<'span6'l><'span6'f>r>t<'row'<'span6'i><'span6'p>>",
		"sPaginationType": "bootstrap",
		"oLanguage": {
			"sLengthMenu": "_MENU_ records per page"
		}
	} );
} );
