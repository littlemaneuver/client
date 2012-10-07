	function Builder (config) {
		// use config object
	}
	Builder.prototype = {
	 	firstLetter: function(word){
			//"use strict";
			return word.substr(0,1).toUpperCase() + word.substr(1);
		},
		buildForm: function(projectСonfig, container){
			//"use strict";
			if(!container){
				var fragment = $('<form id ="new_project" name="data" method="post"></form>'),
					tabsMenu = $('<div id="tabs"></div>'),
					count = 1,
					element,
					self = fragment;
			} else {
				self = container;
			}
			for(var prop in projectСonfig){
				if((typeof projectСonfig[prop] === 'object')&&(projectСonfig[prop]['tabName'])){
					if(count === 1){
						tabsMenu.append($('<ul class = "tabs"></ul><div class="panes"></div>'));
					}
					tabsMenu.find('.tabs').append($('<li><a href="#tabs-'+count+'">'+projectСonfig[prop]['tabName']+'</a></li>'));
					tabsMenu.find('.panes').append($('<div id = "tabs-'+count+'"></div>'));
					this.buildForm(projectСonfig[prop], tabsMenu.find('#tabs-'+count));
					count+=1;
					//console.log(tabsMenu);
					self.append(tabsMenu);
				}
				else if((projectСonfig[prop] === 'int')||(projectСonfig[prop] === 'float')||(projectСonfig[prop] === 'string')){
					element =  $('<p>'+this.firstLetter(prop.toString())+'</p><input type="text" name="'+prop+'" class="'+projectСonfig[prop]+'" size="40">');
					self.append(element); 
				}
				else if(projectСonfig[prop] === 'bool')	{
					element =  $('<p>'+this.firstLetter(prop.toString())+'</p><span>True:</span><input type="radio" name="'+prop+'" class="bool.true"><span>False:</span><input type="radio" name="'+prop+'" class="bool.false">');
					self.append(element);
				}
				else if(projectСonfig[prop] === 'blob')	{
					element =  $('<p>'+this.firstLetter(prop.toString())+'</p><textarea name="'+prop+'" class="blob" cols="30" rows="15">');
					self.append(element);
				}
				else if(projectСonfig[prop].type === 'list_check')	{
					element =  $('<fieldset></fieldset>');
					element.append($('<legend>'+this.firstLetter(prop.toString())+'</legend>'));
					var i = 0;
					while(projectСonfig[prop][i]!==undefined){
						element.append($('<p><input type="checkbox" name="'+projectСonfig[prop][i]+'" class="list_checks">'+projectСonfig[prop][i]+'</p>'));
						i+=1;
					}
					self.append(element);
				}
				else if(projectСonfig[prop].type === 'list_option')	{
					element =  $('<select></select>');
					var i = 0;
					while(projectСonfig[prop][i]!==undefined){
						element.append($('<option value="'+projectСonfig[prop][i]+'" class="list_option">'+projectСonfig[prop][i]+'</option>'));
						i+=1;
					}
					self.append('<p>'+this.firstLetter(prop.toString())+'</p>').append(element);
				}
			}

			self.find('ul.tabs').tabs('div.panes > div');
			if(!container){
				self.append($('<button id="send">Send</button>'));
				return self;
			}
		},
		getJSON: function(formObject){
			//"use strict";
			var json = {};
			$.each(formObject.get(0).elements, function(key,elem){
				elem=$(elem);
				if(elem.attr('type') === 'checkbox'){

				}
				else if((elem.attr('type') === 'radio')&&(elem.attr('checked') === 'checked')){
					if(elem.hasClass('bool.true')){
						console.log('jopa');
						json[elem.attr('name')] = true;
					} else {
						json[elem.attr('name')] = false;
					}
				}
				else{
				json[elem.attr('name')] = elem.val();
				}
			});
			return JSON.stringify(json);
		},
		addEventToSetRow: function(table){
			//"use strict";
			var rows = $('tr', table),
				self = this,
				cells;
			rows.each(function(i, row){
				row = $(row);
				cells = row.find('td');
				cells.each(function(j, cell){
					cell = $(cell);
					if (cell.text() === 'set'){
						row.addClass('set');
						table.delegate('.set', 'click',  row.attr('id'), Events.tableJobSet);
					}
				})
			})

		},
		buildTable: function(jobsObject, container){
			//"use strict";
			var table,
				self = this,
				tr = $('<tr></tr>'),
				columnsConfig = [
					{ 'mData': 'name' },
					{ 'mData': 'type' },
					{ 'mData': 'status' }
				];
			if(container!==undefined){
				table = $('<table id="table"></table>');
			} else {
				table = $('<table id="new_one"></table>');
			}
			tr.append($('<th>Name</th><th>Type</th><th>Status</th>'));
			for(var key in jobsObject[0].parameters){
				tr.append($('<th>'+key+'</th>'));
				columnsConfig.push({ 'mData': 'parameters.'+key });
			}
			table.append($('<thead></thead>').append(tr)).append($('<tbody></tbody>'));
			if(container!==undefined){
				container.append(table);
				table = container.find(table);
			}
			table.dataTable( {
				"bProcessing": true,
				"aaData": jobsObject,
				"aoColumns": columnsConfig, 
				"fnRowCallback": function(row, data){
					$(row).attr('id', data.id);
					return row;
				},
				"fnDrawCallback": function(){
					self.addEventToSetRow(table);
				}
			} );
		return table;
		},
		prepareForTree: function(jobsObject){
			var treeObject = [],
			treeElement = {};
			for (var i = 0, max = jobsObject.length; i < max; i+=1){
				treeElement = {};
				if((jobsObject[i].type === 'set')||(jobsObject[i].type === 'workflow')){
					treeElement['label'] = jobsObject[i].name;
					treeElement['id'] = jobsObject[i].id;
					if(jobsObject[i].subjobs !== undefined){
						treeElement.children = [];
						for(var j = 0, childMax = jobsObject[i].subjobs.length; j<childMax; j++){
							treeElement.children.push({label: jobsObject[i].subjobs[j].name});
						}
					}
					treeObject.push(treeElement);
				}
			}
			console.log(treeObject);
			return treeObject;
		},
		buildTree: function(liteJobsObject, container){
			var treeObject = this.prepareForTree(liteJobsObject);
			container.tree({
					data: treeObject,
					autoOpen: true,
					//selectable: true,
					dragAndDrop: true
				}); 
		}
	}
