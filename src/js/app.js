App = {
  web3Provider: null,
  contracts: {},

  init: async function () {
    // Load pets.
    $.getJSON('../pets.json', function (data) {
      var petsRow = $('#petsRow');
      var emgergency = $('#emgergency');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);
        petTemplate.find('.btn-release').attr('data-id', data[i].id).attr('disabled', true);


        petsRow.append(petTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function () {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    web3 = new Web3(App.web3Provider);
    return App.initContract();
  },

  initContract: function () {

    $.getJSON('Adoption.json', function (data) {
      var AdoptionArtifact = data;

      App.contracts.Adoption = TruffleContract(AdoptionArtifact);
      App.contracts.Adoption.setProvider(App.web3Provider);
      return App.markAdopted();
    });

    return App.bindEvents();
  },

  bindEvents: function () {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
    $(document).on('click', '.btn-release', App.handleRelease);
  },

  markAdopted: function (adopters, account) {

    var adoptionInstance;
    App.contracts.Adoption.deployed().then(function (instance) {
      adoptionInstance = instance;

      return adoptionInstance.getAdopters.call();
    }).then(function (adopters) {
      for (i = 0; i < adopters.length; i++) {
        if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-pet').eq(i).find('.btn-adopt').text('Adopted').attr('disabled', true);
          $('.panel-pet').eq(i).find('.btn-release').text('Release').attr('disabled', false);
        }
      }
    }).catch(function (err) {
      console.log(err.message);
    });
  },

  handleAdopt: function (event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));


    var adoptionInstance;
    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      var collectionAddress = accounts[2];
      var partnerAddress = accounts[3];
      var etherValue = web3.toWei(1, 'ether');
      App.contracts.Adoption.deployed().then(function (instance) {
        adoptionInstance = instance;
        var x = adoptionInstance.adopt(petId,etherValue,{ from: account , value:etherValue});
        return adoptionInstance.withdraw(collectionAddress,partnerAddress,{ from: account});
      }).then(function (result) {
        return App.markAdopted();

      }).catch(function (err) {
        console.log(err.message);
      });
    });
  },

  markReleased: function (adopters, account) {

    var adoptionInstance;
    App.contracts.Adoption.deployed().then(function (instance) {
      adoptionInstance = instance;
      return adoptionInstance.getAdopters.call();
    }).then(function (adopters) {
      for (i = 0; i < adopters.length; i++) {
        if (adopters[i] === '0x0000000000000000000000000000000000000000') {
          $('.panel-pet').eq(i).find('.btn-adopt').text('Adopt').attr('disabled', false);
          $('.panel-pet').eq(i).find('.btn-release').text('Released').attr('disabled', true);
        }
      }
    }).catch(function (err) {
      console.log(err.message);
    });
  },

  handleRelease: function (event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));


    var adoptionInstance;
    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.Adoption.deployed().then(function (instance) {
        adoptionInstance = instance;
        return adoptionInstance.release(petId, { from: account });
      }).then(function (result) {
        return App.markReleased();
      }).catch(function (err) {
        console.log(err.message);
      });
    });
  }
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});