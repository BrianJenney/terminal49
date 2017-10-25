

angular.module('myApp')

.controller('HomeCtrl', ['$scope', '$http', 'toastr', '$routeParams', function($scope, $http, toastr, $routeParams) {	

	/*
	Initial Vars
	*/
	let vm = this;

	vm.userSearch = '';
	vm.shipInfo = {};
	vm.error = false;
	vm.showUpdates = false;
	vm.updates = [];
	vm.savedInfo = [];

	/*
	Functions
	*/
	vm.getListing = getListing;
	vm.getUpdates = getUpdates;
	vm.getsavedbookings = getSavedIds;
	vm.removeItem = removeSavedId;

	vm.showUpdate = showUpdate;
	vm.hideUpdate = hideUpdate;
	vm.saveId = saveId;
	vm.useId = useId;

	/*
	Iniitialize Page
	*/

	(init=()=>{
		vm.getsavedbookings();
		const urlstring = $routeParams.id;
		vm.userSearch = urlstring;
		getListing();
	})();

	
	//retrieve listings from user search
	function getListing(){
		$http.get('/getshipdata/' + vm.userSearch).then((response)=>{
			if(response.data.success){
				vm.shipInfo = response.data; vm.error = false;
			}
			else{
				vm.shipInfo = {}; vm.error = true;
			}
				
		},(err)=>{
			vm.error = true;
		});
	};

	//get updates by container id
	function getUpdates(id){
		vm.updates = vm.shipInfo.updates.filter((item)=>{
			return item.container_number === id;
		});
		if(vm.showUpdates)
			hideUpdate();
		else
			showUpdate();

	};

	//save id of container for later use and return message to user in case of dups
	function saveId(id){
		$http.post('/savebooking/'+id).then((response)=>{
			if(response.data.isDup){
				toastr.error("You have already saved this ID!")
			}else{
				toastr.success("ID saved!")
				getSavedIds();
			}
			
		});
	};

	//return all saved ids
	function getSavedIds(){
		$http.get('/getsavedbookings').then((response)=>{
			console.log(response);
			vm.savedInfo = response.data;
		});
	};

	//remove one or all of the saved booking ids
	function removeSavedId(id){
		$http.post('/deletebooking/' + id).then((response)=>{
			vm.getsavedbookings();
		}, (err)=>{
			toastr.error('Unable to delete!');
		});
	};

	function useId(id){
		vm.userSearch = id;
		vm.getListing();
	};

	//hide and show functions for updates
	function showUpdate(){
		vm.showUpdates = true;
	};

	function hideUpdate(){
		vm.showUpdates = false;
	};

 }]);
