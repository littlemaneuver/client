
Events = {
	build : new Builder({
		formC: $('#form_container'),
		tableC: $('#table_container'),
		treeC: $('#tree')
	}),
	connect: new Connection(),
	clickedRows: [],
	onCloseModal: function (dialog) {
		Events.clickedRows = [];
		$(dialog.container[0]).empty();
		$.modal.close(); 
	},
	tableJobSet: function(e, id){
		var self = Events,
			tableC = $('#table_container'),
			cR = self.clickedRows;
		e.preventDefault();
		console.log(e, id);
		id = e.data||id;
		if((e.data!==null)||(e.data!==undefined)){
			for(var i = 0, max = cR.length; i< max; i++){
				if(cR[i] == id){
					return false;
				}
			}
			cR.push(e.data);
			var jsonData = self.connect.getJobs(parseInt(id, 10));
			tableC.append(self.build.buildTable(jsonData));
		} else {
			var jsonData = self.connect.getJobs();
			self.build.buildTable(jsonData, tableC);
		}
		tableC.modal({onClose: self.onCloseModal});
	},
	treeExample: function(tree){
		var self = this;
		tree = self.build.buildTree(self.connect.getJobsTree(), tree);
		tree.bind('select_node.jstree', function(event, data){
				self.tableJobSet(event, data.rslt.obj.find('a').attr('id'));
			})
	}
}
/*-------------------------------Handlers--------------------------------*/
$(document).ready(function(){
	var keyFlag = true,
		ctrlKey = true,
		keyNames = {
			'TAB': 9,
		    'ENTER': 13,
		    'BACKSPACE': 8,
		    'CTRL': 17,
		    'ALT': 18,
		    'LEFT': 37,
		    'RIGHT': 39
		};
	$('#form_container').delegate('.int','keypress', function(e){
		keyFlag = true;
		ctrlKey =true;
		for(var prop in keyNames){
			if((e.keyCode == keyNames[prop])){//for Firefox!!!
				keyFlag = false;
			}
		}
		if(e.ctrlKey&&(
				(e.which === 97)//ctrl+a
				||(e.which === 99)//ctrl+c
				||(e.which === 118)//ctrl+v
				||(e.which === 120)//ctrl+x
				)){
			ctrlKey = false;
		}
		if(ctrlKey&&keyFlag&&((e.which<48)||(e.which>57))){
			return false;
		} 
	});
	$('#form_container').delegate('.float','keypress', function(e){
		keyFlag = true;
		ctrlKey =true;
		for(var prop in keyNames){
			if(e.keyCode == keyNames[prop]){ // for Firefox!
				keyFlag = false;
			}
		}
		if(e.ctrlKey&&(
				(e.which === 97)//ctrl+a
				||(e.which === 99)//ctrl+c
				||(e.which === 118)//ctrl+v
				||(e.which === 120)//ctrl+x
				)){
			ctrlKey = false;
		}
		if( ctrlKey
			&&keyFlag
			&&((e.which<46)
			||(e.which>57)
			||(e.which === 47))
			||(($(this).val().match(/\./))&&(e.which === 46))){
			return false;
		}
	});
	$('#form_container').delegate('#send','click', function(e){
		e.preventDefault();
		console.log(Events.build.getJSON($('#new_project')));
		$('.modalCloseImg').trigger('click');
	});
	Events.treeExample($('#tree'));
});