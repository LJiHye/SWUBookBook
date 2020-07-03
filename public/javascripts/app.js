App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    $.ajax({
      type: 'POST',
      url: '/load',
      dataType: 'json',
      success: function(data) {
        //alert(data[0].title);

        var list = $('#list');
        var template =$('#template');

        for (i=data.length-1; i>=0; i--){
          template.find('.id').text(i);
          template.find('img').attr('src', data[i].imageUrl);
          template.find('.ISBN').text(data[i].isbn);
          template.find('.name').text(data[i].title);
          template.find('.author').text(data[i].author);
          template.find('.realPrice').text(data[i].realPrice);
          template.find('.sellPrice').text(data[i].sellPrice);
          template.find('.state').text(data[i].state);

          var id = template.find('.id').text(data[i]._id);
          //alert(template.find('.id').text());

          list.append(template.html());
        }
      },
      error:function(request,status,error){
        alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);}
    })
 
    return App.initWeb3();
   },

   //원본
  /*init: function() {
   $.getJSON('../book-list.json', function(data){
     var list = $('#list');
     var template =$('#template');

     for (i =0; i< data.length; i++){
       template.find('img').attr('src', data[i].picture);
       template.find('.ISBN').text(data[i].ISBN);
       template.find('.type').text(data[i].type);
       template.find('.name').text(data[i].name);
       template.find('.price').text(data[i].price);
       template.find('.seller-id').text(data[i].sellerId);

       list.append(template.html());
     }
   })

   return App.initWeb3();
  },*/

  /*init: function(books) {
    for(i=0; i<books.length; i++) {
      template.find('img').attr('src', books[i].imageUrl);
      template.find('.ISBN').text(books[i].isbn);
      template.find('.type').text(books[i].sellPrice);
      template.find('.name').text(books[i].title);
      template.find('.price').text(books[i].realPrice);
      template.find('.seller-id').text(books[i].author);
  
      list.append(template.html());
    }
  
     return App.initWeb3();
    },*/

  initWeb3: function() {
    if (typeof web3 !== 'undefined'){
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  initContract: function() {
		$.getJSON('../build/contracts/RealEstate.json', function(data){
      App.contracts.RealEstate = TruffleContract(data);
      App.contracts.RealEstate.setProvider(App.web3Provider);
      App.listenToEvents();
    });
  },

  buyRealEstate: function() {
    var id = $('#id').val();
    var price = $('#sellPrice').val();
    var email = $('#email').val();
    var passwd = $('#passwd').val();

    web3.eth.getAccounts(function(error, accounts) {
      if(error){
        console.log(error);
      }

      var account = accounts[0];
      App.contracts.RealEstate.deployed().then(function(instance){
        return instance.buyRealEstate(id, web3.toHex(email) , web3.toHex(passwd), { from: account, value: price});
      }).then(function(){
        $('#email').val('');
        $('#passwd').val('');
        $('#buyModal').modal('hide');
      }).catch(function(err){
        console.log(err.message);
      });
    });
  },

  loadRealEstates: function() {
    App.contracts.RealEstate.deployed().then(function(instance){
      return instance.getAllBuyers.call();
    }).then(function(buyers){
      for(i = 0; i < buyers.length; i++){
        if(buyers[i] !== '0x0000000000000000000000000000000000000000'){
          $('.panel-realEstate').eq(i).find('img').attr('src', 'public/images/done.png');     
          $('.panel-realEstate').eq(i).find('.btn-buy').text('판매완료').attr('disabled',true);
          $('.panel-realEstate').eq(i).find('.btn-buyerInfo').removeAttr('style');
        }
      }
    }).catch(function(err){
      console.log(err.message);
    })
  },

  listenToEvents: function() {
    App.contracts.RealEstate.deployed().then(function(instance) {
      instance.LogBuyRealEstate({}, { fromBlock: 0, toBlock: 'latest' }).watch(function(error, event) {
        if (!error) {
          console.log('not listen error');
          $('#events').append('<p>' + event.args._buyer + ' 계정에서 ID: ' + event.args._id + ', ISBN: ' + event.args._ISBN + ' 책을 구매했습니다</p>');
        } else {
          console.log('listen error');
        }
        App.loadRealEstates();
      })
    })
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });

  $('#buyModal').on('show.bs.modal', function(e){
    var ISBN = $(e.relatedTarget).parent().find('.ISBN').text();
    var id = $(e.relatedTarget).parent().find('.id').text();
    var name = $(e.relatedTarget).parent().find('.name').text();
    var sellPrice = web3.toWei(parseFloat($(e.relatedTarget).parent().find('.sellPrice').text() || 0), "ether");

    $(e.currentTarget).find('#ISBN').val(ISBN);
    $(e.currentTarget).find('#id').val(id);
    $(e.currentTarget).find('#name').val(name);
    $(e.currentTarget).find('#sellPrice').val(sellPrice);
  });

  $('#buyerInfoModal').on('show.bs.modal', function(e) {
    var id = $(e.relatedTarget).parent().find('.id').text();
   
    App.contracts.RealEstate.deployed().then(function(instance) {
      return instance.getBuyerInfo.call(id);
    }).then(function(buyerInfo) {
      $(e.currentTarget).find('#buyerAddress').text(buyerInfo[0]);
      $(e.currentTarget).find('#buyerEmail').text(buyerInfo[1]);
      $(e.currentTarget).find('#buyerPasswd').text(buyerInfo[2]);
    }).catch(function(err) {
      console.log(err.message);
    })
  });
});
