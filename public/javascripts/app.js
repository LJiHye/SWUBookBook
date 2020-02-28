App = {
  web3Provider: null,
  contracts: {},

  init: function() {
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
  },

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
		$.getJSON('../RealEstate.json', function(data){
      App.contracts.RealEstate = TruffleContract(data);
      App.contracts.RealEstate.setProvider(App.web3Provider);
    });
  },

  buyRealEstate: function() {
    var ISBN = $('ISBN').val();
    var price = $('price').val();
    var id = $('id').val();
    var passwd = $('passwd').val();

    web3.eth.getAccounts(function(error, accounts){
      if(error){
        console.log(error);
      }

      var account = accountS[0];
      App.contracts.RealEstate.deployed().then(function(instance){
        var nameUTF8Encoded = utf8.encode(id);
        return instance.buyRealEstate(ISBN, web3.toHex(nameUTF8Encoded), passwd, { from: account, value: price});
      }).then(function(){
        $('#id').val('');
        $('#passwd').val('');
        $('#buyModal').modal('hide');
      }).catch(function(err){
        console.log(err.message);
      });
    });
  },

  loadRealEstates: function() {

  },

  listenToEvents: function() {

  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });

  $('#buyModal').on('show.bs.modal', function(e){
    var ISBN = $(e.relatedTarget).parent().find('.ISBN').text();
    var price = web3.toWei(parseFloat($(e.relatedTarget).parent().find('.price').text() || 0), "ether");

    $(e.currentTarget).find('#ISBN').val(ISBN);
    $(e.currentTarget).find('#price').val(price);
  })
});
