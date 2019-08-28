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
      return App.loadOnStartup();
    });

  },

  bindEvents: function () {
    $(document).on('click', '.btn-stop', App.handleStop);
    $(document).on('click', '.btn-start', App.handleStart);
    $(document).on('click', '.btn-withdraw', App.handleWithDraw);
  },
loadOnStartup: function (event) {
 const deployedInstance = App.contracts.Adoption.deployed();
        web3.eth.getAccounts(function (error, accounts) {
          if (error) {
            console.log(error);
          }
          var account = accounts[0];
          deployedInstance.then(function (instance) {
            abcoinInstance = instance;
            return abcoinInstance.isContractStopped({ from: account });
          }).then(function (result) {
            console.log('Is contract stopped', `${result}`);
            if(`${result}` == 1){
                $('#adminScreen').find('.btn-stop').attr('disabled', true);
                $('#adminScreen').find('.btn-start').attr('disabled', false);
            }else{
                $('#adminScreen').find('.btn-stop').attr('disabled', false);
                $('#adminScreen').find('.btn-start').attr('disabled', true);
            }
            return true;
          }).catch(function (err) {
            console.log(err.message);
          });
        });
        App.getBalance();
    return App.bindEvents();
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
  },



handleWithDraw: function (event) {
    event.preventDefault();
    var adoptionInstance;
    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      var collectionAddress = accounts[2];
      var partnerAddress = accounts[3];
      App.contracts.Adoption.deployed().then(function (instance) {
        adoptionInstance = instance;
        return adoptionInstance.withdraw(collectionAddress,partnerAddress,{ from: account});;
      }).then(function (result) {
           App.getBalance();
            $('#adminScreen').find('.btn-withdraw').attr('disabled', true);
      }).catch(function (err) {
        console.log(err.message);
      });
    });
  },


   getBalance: function (event) {
      var adoptionInstance;
       web3.eth.getAccounts(function (error, accounts) {
         if (error) {
           console.log(error);
         }
         var account = accounts[0];
         var ownerBalance = web3.eth.getBalance(accounts[0]);
         var ownerBalanceinEther = web3.fromWei(ownerBalance, 'ether')
         $('#adminScreen').find('.contract-ether-owner-balance').text(`${ownerBalanceinEther}`);
         console.log("Admin EtherBalance", ownerBalanceinEther);
         var partner1Balance = web3.eth.getBalance(accounts[2]);
         var partner1BalanceinEther = web3.fromWei(partner1Balance, 'ether')
         $('#adminScreen').find('.contract-ether-partner1-balance').text(`${partner1BalanceinEther}`);
         console.log("Partner 1  EtherBalance", partner1BalanceinEther);
         var partner2Balance = web3.eth.getBalance(accounts[3]);
          var partner2BalanceinEther = web3.fromWei(partner2Balance, 'ether')
         $('#adminScreen').find('.contract-ether-partner2-balance').text(`${partner2BalanceinEther}`);
         console.log("Partner 2  EtherBalance", partner2BalanceinEther);

         var contractAccount = '0xFe2E1Cdb585609426d404045cd5cACB95D3Ba4c8';
         var contractBalance = web3.eth.getBalance(contractAccount);
         var contractBalanceinEther = web3.fromWei(contractBalance, 'ether');
          $('#adminScreen').find('.contract-ether-balance').text(`${contractBalanceinEther}`);
                  console.log("Contract  EtherBalance", contractBalanceinEther);
         return true;

       });
       }



};

$(function () {
  $(window).load(function () {
    App.init();
  });
});