$(document).ready(function(){
    window.addEventListener('message', function( event ) {             
      if (event.data.action == 'open') {
        $('.container').css('display', 'block');
        $('.inv-head-btn p').text('');

        $('.sub-container').css('display', 'none');
      } else if (event.data.action == 'close') {
        $('.container').css('display', 'none');
        $('.sub-container').css('display', 'none');
      } else if (event.data.action == 'add') {       
        AddItem(event.data.identifier, event.data.item, event.data.count, event.data.name, event.data.label, event.data.rare, event.data.can_remove, event.data.url, event.data.useable);
      } else if (event.data.action == 'reset') {
        const inv = document.getElementById("invcontainer");
        inv.innerHTML = '';
        $('.inv-head-btn p').text('');

        if (event.data.money >= 1) {
          $('#invcontainer').append(
            `
            <div class="inv-cont-elem" id="element-money" onclick="select(this);" style="background-image: url(https://image.flaticon.com/icons/svg/639/639365.svg);" data-itype="cash" data-count="` + event.data.money + `">
    
            </div>      
            `
          );
        }
      } else if (event.data.action == 'updatemax') {        
        $("#amount").attr('max', (parseInt($('.selected').attr('data-count')) - event.data.max));
        $('.selected').attr('data-count', (parseInt($('.selected').attr('data-count')) - event.data.max))
        
        $('.inv-head-btn p').text((parseInt($('.selected').attr('data-count')) - event.data.max) + 'x');

        if ((parseInt($('.selected').attr('data-count')) - event.data.max) <= 0) {
          $('.selected').remove();
        }
      } else if (event.data.action == 'updatecash') {
        $('.inv-head-btn p').text(event.data.nmoney + 'x');
      }
    });

    function AddItem(identifier, item, count, name, label, rare, can_remove, url, useable) { 
      if (count <= 0) {
        return
      }
                   
      $('#invcontainer').append(
        `
        <div class="inv-cont-elem" onclick="select(this);" style="background-image: url(` + url + `);" data-itype="item" data-identifier="` + identifier + `" data-item="` + item + `" data-count="` + count + `" data-name="` + name + `" data-label="` + label + `" data-rare="` + rare + `" data-can_remove="` + can_remove + `" data-url="` + url + `" data-useable=` + useable + `>

        </div>      
        `
      );
    }
 
    $( "#close" ).click(function() {
      $('.container').css('display', 'none');
      $.post('http://ps_inventory/escape', JSON.stringify({}));
    });  

    $( "#refresh" ).click(function() {      
      $.post('http://ps_inventory/refresh', JSON.stringify({}));
    }); 

    $('#use').click(function() {
      var count = $('.selected').attr('data-count'); 
      var amount = $("#amount").val(); 
      var type = $('.selected').attr('data-itype');
      
      if (count >= amount) {
        if (type == 'item') {
          $('.selected').attr('data-count', (count - amount))
          $("#amount").attr('max', (count - amount));           

          $.post('http://ps_inventory/use', JSON.stringify(
            {
              item: $('.selected').attr('data-name'),
              amount: $("#amount").val(),
              label: $('.selected').attr('data-label'),
            }
          ));

          $('.inv-head-btn p').text($('.selected').attr('data-count') + 'x');

          if ($('.selected').attr('data-count') <= 0) {
            $('.selected').remove();
            $('.sub-container').css('display', 'none');
          } 
        }
      }
    });

    $('#throw').click(function() {
      var count = $('.selected').attr('data-count'); 
      var amount = $("#amount").val(); 
      var type = $('.selected').attr('data-itype');
      
      if (count >= amount) {
        if (type == 'item') {
          $('.selected').attr('data-count', (count - amount))
          $("#amount").attr('max', (count - amount));           

          $.post('http://ps_inventory/throw', JSON.stringify(
            {
              item: $('.selected').attr('data-name'),
              amount: $("#amount").val(),
              label: $('.selected').attr('data-label'),
            }
          ));

          $('.inv-head-btn p').text($('.selected').attr('data-count') + 'x');

          if ($('.selected').attr('data-count') <= 0) {
            $('.selected').remove();
            $('.sub-container').css('display', 'none');
          } 
        } else if (type == 'cash') {
          $('.selected').attr('data-count', (count - amount))
          $("#amount").attr('max', (count - amount));           
          
          $.post('http://ps_inventory/throwCash', JSON.stringify(
            {
              amount: $("#amount").val(),
            }
          ));

          $('.inv-head-btn p').text($('.selected').attr('data-count') + 'x');

          if ($('.selected').attr('data-count') <= 0) {
            $('.selected').remove();
            $('.sub-container').css('display', 'none');
          } 
        }
      }
    });

    $('#give').click(function() {
      var count = $('.selected').attr('data-count'); 
      var amount = $("#amount").val(); 
      var type = $('.selected').attr('data-itype');

      if (count >= amount) {
        if (type == 'item') {
          $.post('http://ps_inventory/give', JSON.stringify(
            {
              item: $('.selected').attr('data-name'),
              amount: $("#amount").val(),
              label: $('.selected').attr('data-label'),
            }
          ));
        } else if (type == 'cash') {
          $.post('http://ps_inventory/givecash', JSON.stringify(
            {
              amount: $("#amount").val(),
            }
          ));
        }
      }
    });
});

function select(elem) {
  $('.inv-cont-elem').removeClass('selected');
  $(elem).addClass('selected');
  $('.sub-container').css('display', 'block');

  $('.inv-head-btn p').text($(elem).attr('data-count') + 'x');

  $('#amount').attr('max', $(elem).attr('data-count'));
  $("#amount").val(1);
  
  if ($(elem).attr('data-useable') == 'true' && $(elem).attr('data-itype') == 'item') {
    $('#use').show();
  } else {
    $('#use').hide();
  }
}