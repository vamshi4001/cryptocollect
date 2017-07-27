angular.module("firstApp")
	.controller("homeController", homeController);

	function homeController($scope, $http, $rootScope, userService){
		// $scope.url = "https://www.cryptocompare.com/api/data/coinlist/";
		$scope.cryptos = {"BTC": {"id": "bitcoin", "name": "Bitcoin", "symbol": "BTC", }, "ETH": {"id": "ethereum", "name": "Ethereum", "symbol": "ETH", }, "XRP": {"id": "ripple", "name": "Ripple", "symbol": "XRP", }, "LTC": {"id": "litecoin", "name": "Litecoin", "symbol": "LTC", }, "DASH": {"id": "dash", "name": "Dash", "symbol": "DASH", }, "ETC": {"id": "ethereum-classic", "name": "Ethereum Classic", "symbol": "ETC", }, "XEM": {"id": "nem", "name": "NEM", "symbol": "XEM", }, "XMR": {"id": "monero", "name": "Monero", "symbol": "XMR", }, "GNT": {"id": "golem-network-tokens", "name": "Golem", "symbol": "GNT", }, "REP": {"id": "augur", "name": "Augur", "symbol": "REP", }, "MAID": {"id": "maidsafecoin", "name": "MaidSafeCoin", "symbol": "MAID", }, "ZEC": {"id": "zcash", "name": "Zcash", "symbol": "ZEC", }, "GNO": {"id": "gnosis-gno", "name": "Gnosis", "symbol": "GNO", }, "PIVX": {"id": "pivx", "name": "PIVX", "symbol": "PIVX", }, "STRAT": {"id": "stratis", "name": "Stratis", "symbol": "STRAT", }, "DOGE": {"id": "dogecoin", "name": "Dogecoin", "symbol": "DOGE", }, "DCR": {"id": "decred", "name": "Decred", "symbol": "DCR", }, "FCT": {"id": "factom", "name": "Factom", "symbol": "FCT", }, "STEEM": {"id": "steem", "name": "Steem", "symbol": "STEEM", }, "DGD": {"id": "digixdao", "name": "DigixDAO", "symbol": "DGD", }, "WAVES": {"id": "waves", "name": "Waves", "symbol": "WAVES", }, "USDT": {"id": "tether", "name": "Tether", "symbol": "USDT", }};

		$scope.url = "./coinlist.json";
		$scope.coinlist = [];
		$scope.completeTotalUSD = 0;
		$scope.completeTotalINR = 0;
		$scope.selected = "INR";
		$scope.items = [];
			
		$scope.updateCost = function(){
			$scope.completeTotalUSD = 0;
			$scope.completeTotalINR = 0
			for(i in $scope.coinlist){
				if($scope.coinlist[i] && $scope.prices[$scope.coinlist[i].Name]){
					$scope.completeTotalUSD += Math.round(parseFloat($scope.coinlist[i].quantity?$scope.coinlist[i].quantity:0)*$scope.prices[$scope.coinlist[i].Name]["USD"]*100)/100;
					$scope.completeTotalINR += Math.round(parseFloat($scope.coinlist[i].quantity?$scope.coinlist[i].quantity:0)*$scope.prices[$scope.coinlist[i].Name]["USD"]*$scope.conversionFactor*100)/100;
					$scope.completeTotalUSD = Math.round($scope.completeTotalUSD*100)/100
					$scope.completeTotalINR = Math.round($scope.completeTotalINR*100)/100
				}				
			}
		}
		$scope.update = function(selectedCurrency){
			$scope.conversionFactor = $scope.conversion[selectedCurrency];
		}
		$http.get($scope.url).then(function(response){
			if(response.data.Response=="Success"){
				$scope.BaseImageUrl = response.data.BaseImageUrl;
				$scope.BaseLinkUrl = response.data.BaseLinkUrl;
				$scope.coins = response.data.Data;
				delete $scope.coins["PIVX"];
				for(key in $scope.coins){
					$scope.coinlist.push($scope.coins[key]);
				}
				$scope.coinlist.sort(function(a, b) {
				    return parseInt(a.SortOrder) - parseInt(b.SortOrder);
				});				
				
				// $scope.coinlist = $scope.coinlist.slice(0,98);
			}
			var keys = Object.keys($scope.cryptos);
			$http.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=' + keys.join() + '&tsyms=USD,EUR').then(function(result){
				$scope.prices = result.data;
				$http.get("http://api.fixer.io/latest?base=USD").then(function(res){
					$scope.conversion = res.data.rates;
					$scope.items = Object.keys($scope.conversion);
				})
			})			
		})		
	}

	// Status - 200, 404, 500, 403, 301