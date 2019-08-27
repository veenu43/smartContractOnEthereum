App = {
  web3Provider: null,
  contracts: {},

  init: async function () {
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
      return true;
    });



    $('#adminScreen').find('.btn-stop').attr('disabled', false);
    $('#adminScreen').find('.btn-start').attr('disabled', false);
    return App.bindEvents();
  },

  bindEvents: function () {
    $(document).on('click', '.btn-stop', App.handleStop);
    $(document).on('click', '.btn-start', App.handleStart);
  },

handleStop: function (event) {
    event.preventDefault();
    var adoptionInstance;
    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.Adoption.deployed().then(function (instance) {
        adoptionInstance = instance;
        return adoptionInstance.stopContract({ from: account });
      }).then(function (result) {
            $('#adminScreen').find('.btn-stop').attr('disabled', true);
            $('#adminScreen').find('.btn-start').attr('disabled', false);
      }).catch(function (err) {
        console.log(err.message);
      });
    });
  },



handleStart: function (event) {
    event.preventDefault();
    var adoptionInstance;
    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.Adoption.deployed().then(function (instance) {
        adoptionInstance = instance;
        return adoptionInstance.resumeContract({ from: account });
      }).then(function (result) {
            $('#adminScreen').find('.btn-stop').attr('disabled', false);
            $('#adminScreen').find('.btn-start').attr('disabled', true);
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