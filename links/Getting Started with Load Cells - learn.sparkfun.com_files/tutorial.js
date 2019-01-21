// Tutorials plugin
(function( $ ){

  var methods = {
    init: function( options ) {
      var self = this;

      if($('.tutorial-page pre').is('*')) {
        $(self).tutorial('rainbow');
      }

      if($('#sections').is('*')) {
        $(self).tutorial('init_all');
      }

      if(window.location.hash) {
        require([
          'jqueryui',
        ], function() {
          var hash = window.location.hash.substring(1);
          if($('#' + hash).length)
            $('#' + hash).closest('.section').effect('highlight', {}, 2000);
        });
      }
    },

    rainbow: function() {
      // syntax highlighting
      require([
        'rainbow',
      ], function() {
        require([
          'generic',
          'c',
        ], function() {
          // set up the coloring params and throw in a hidden div with the code for copying
          $('.tutorial-page pre').each(function(i, el) {
            var lines, $el = $(el),
                code = $el.find('code').html(),
                lang = code.match(/^language:([a-zA-Z]+\n)/);

            // if we have a language, set up rainbowjs, add an id attribute for clipboard js
            if(lang) {
              // remove the first line with the language and turn it into an attribute.
              lines = code.split('\n');
              lines.splice(0,1);
              code = lines.join('\n');
              $el.html(code).wrapInner('<code />').attr('data-language', lang);
            }

            // add a copy button with declarative syntax for clipboard js
            // use 'data-clipboard-text' attribute rather than point to the code element to avoid picking up the formatting
            $el.prepend($('<button>').addClass('btn btn-default btn-sm copy-code').attr('data-clipboard-text', code).text('Copy Code'));
          });

          // do the coloring
          Rainbow.color();

          // wire up the copy buttons
          require(['clipboard.min'], function (Clipboard) {

            var clipboard = new Clipboard('.copy-code', {
              text: function(trigger) {
                // coalesce just in case the attribute is missing.
                var text = trigger.getAttribute('data-clipboard-text') || '';
                // de-entitize.
                return text.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
              }
            });

            clipboard.on('success', function(e) {
              $(e.trigger).html('Copied!').effect('highlight');
            });

          });
        });
      });
    },
    get_section_offsets: function() {
      var offsets = {};
      $('#sections .section').each(function() {
        var $this = $(this);
        offsets[Math.floor($this.offset().top - 50)] = $this.find('h2').attr('id');
      });
      return offsets;
    },
    init_all: function() {
      var $self = $(this),
          $window = $(window),
          sidebar_affix = $('#sidebar_affix'),
          sidebar_container = $('#nav-pages'),
          footer_element = $('footer'),
          tutorial_element = $('#tutorial'),
          sections = $('#sections .section');

      sidebar_affix.affix({
        offset: {
          top: function () {
            return (sidebar_container.offset().top - 10);
          },
          bottom: function () {
            return (footer_element.outerHeight(true));
          }
        }
      })

      if (sections.length > 0) {
        // if we're "view-all"ing
        var didScroll = true,
            didResize = true;
        $window.scroll(function() {
          didScroll = true;
        });
        $window.resize(function() {
          didResize = true;
        });
        setInterval(function() {
          if(didResize) {
            didResize = false;
            tutorial_element.tutorial('resized');
          }
          if(didScroll) {
            didScroll = false;
            var pos = $window.scrollTop();
            tutorial_element.tutorial('scrolled', pos);
          }
        }, 100);

        tutorial_element.imagesLoaded(function() {
          tutorial_element.tutorial('resized');
          tutorial_element.tutorial('scrolled', $window.scrollTop()); //initial section highlighting on load
        })
      }
    },
    resized: function() {
      $self = $(this);
      $self.data('offsets', $self.tutorial('get_section_offsets'));
      $self.tutorial('scrolled', $(window).scrollTop());
    },
    scrolled: function(pos) {
      function scrollIn($target) {
      // scroll into view
      if($target.length < 1){
        return;
      }
        var $scrollParent = $target.scrollParent(),
            targetHeight = $target.outerHeight(),
            targetTop = $target.offset().top, 
            targetBottom = targetTop + targetHeight,
            parentHeight = $scrollParent.height(),
            parentOffset = $scrollParent.offset(),
            parentTop = parentOffset ? parentOffset.top : 0,
            parentBottom = parentTop + parentHeight,
            parentScroll = $scrollParent.scrollTop(),
            top = null;

        if (targetTop < parentTop) {
          top = targetTop - parentTop + parentScroll;
        }
        else if (targetBottom > parentBottom) {
          top = targetBottom - parentTop + parentScroll - parentHeight
        }
        if(top !== null) {
          $scrollParent.animate({"scrollTop": top}, 'fast');
        }
      }

      var hilite = '',
          $pageList = $('#tutorial-pages'),
          offsetData = $(this).data('offsets'),
          $active, $target, $scrollParent, top;
      if (offsetData) {
        $.each(offsetData, function(k, v) {
          if (pos >= k) {
            hilite = v;
          }
        });
      }
      $active = $pageList.find('.list-group-item.active');
      $target = $pageList.find('.list-group-item[data-pagename="'+ hilite +'"]');
      if ($target.is($active)) {
        return;  //status quo
      }
      // change hightlighting
      $active.removeClass('active');
      $target.addClass('active');
      scrollIn($target);
    }

  };

  $.fn.tutorial = function( method ) {
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.learn' );
    }
  };

})( jQuery );
