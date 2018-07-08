var minScale = 0.4;
var maxScale = 2;
var incScale = 0.1;

var $container = $("#content");
var Selected = null;
var ItemEnCoursDeCreation = null;
var EditEnCour = false;
var NbItem = 0;
var SwitchNB =0;
var NB_INTER_Switch = 16; // nb divisible par 2 !!

var HostUsed = [];




/////////////////////////
////  PANZOOM INIT  ////
///////////////////////

var $panzoom = $('.panzoom').panzoom({
  contain: 'invert',
  minScale: minScale,
  maxScale: maxScale,
  increment: incScale,
  cursor: "",
  $reset: $("#VIEW_BTN")
})
.on("panzoomstart",function(){
  $panzoom.css("cursor","move");
})
.on("panzoomend",function(){
  $panzoom.css("cursor","");
});


$("#VIEW_BTN").click(function() {  
  $("#VIEW_BTN").addClass("imgbtn_block");
});






////////////////////
//// DOWNLOAD  ////
//////////////////

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}


$("#DOWN_BTN").click(function() {

  //Demander le nom du projet
  var name;
  do {
    name=prompt("Nom du Projet :");
  }
  while(name.length < 1);


  //Création du Projet
  var Projet = new Object();
  Projet.Name = name;
  Projet.Hosts = [];
  Projet.Links = [];
  Projet.Bridges = [];


  $(".item").each(function( index ) {
    Host = new Object();
    Host.Name = $( this ).find("#Title").text();
    Host.Type = $( this ).attr("type");
    Host.Interfaces = $( this ).attr("nbInter");

    //Ajout de l'Host dans la config
    Projet.Hosts.push(Host);
  });


  //On parcours toutes les connexions mises en places
  var con=jsPlumb.getAllConnections();
  for(var i=0;i<con.length;i++){

    eSource = con[i].endpoints[0];
    eTarget = con[i].endpoints[1];

      //Si ce n'est pas un Switch
      if (eSource.getParameter("type")!="Switch" && eTarget.getParameter("type")!="Switch") {

        //Création du lien
        Link = new Object();
        Link.H1 = eSource.getParameter("host");
        Link.I1 = eSource.getParameter("interface");
        Link.H2 = eTarget.getParameter("host");
        Link.I2 = eTarget.getParameter("interface");

        //Ajout du lien dans la config
        Projet.Links.push(Link);
      }
  }

  //On parcours tout les Switchs
  $('.item[type="Switch"]').each(function( index ) {
    var Bridge = new Object();
    Bridge.Hosts = [];
    Bridge.Interfaces = [];

    ID = $(this).attr("id");
	
    //On traite toutes les connexions qui partent du switch
    jsPlumb.select({source:ID}).each(function(connection) {
	if (connection.endpoints[1].getParameter("type")!="Switch") {
          Bridge.Hosts.push(connection.endpoints[1].getParameter("host"));
          Bridge.Interfaces.push(connection.endpoints[1].getParameter("interface"));
        }

        console.log(connection.endpoints[1].getParameter("host"));
        console.log(connection.endpoints[1].getParameter("interface"));

    });
    
    //On traite toutes les connexions qui arrivent sur le switch
    jsPlumb.select({target:ID}).each(function(connection) {
        if (connection.endpoints[0].getParameter("type")!="Switch") {
          Bridge.Hosts.push(connection.endpoints[0].getParameter("host"));
          Bridge.Interfaces.push(connection.endpoints[0].getParameter("interface"));
        }

        console.log(connection.endpoints[0].getParameter("host"));
        console.log(connection.endpoints[0].getParameter("interface"));
    });


    //Ajout du Switch dans la config
    Projet.Bridges.push(Bridge);
  });

  //Création du String JSON
  STR_JSON = JSON.stringify(Projet);

  //Téléchargement du fichier
  download("Config_" + Projet.Name + ".json",STR_JSON)
});



//////////////////////////
////  BOUTON DELETE  ////
////////////////////////

$("#DEL_BTN").click(function() {  
  if ( (NbItem != 0) && (Selected != null)) {
  	
  	//On supprime le nom d'host dans la liste des hosts déja utilisés
  	HOST = Selected.find("p").text();
  	index = jQuery.inArray(HOST,HostUsed);
  	HostUsed.splice(index,1);

    jsPlumb.remove(Selected);
    //Selected.remove();
    Selected = null;
    NbItem -= 1;
    $("#DEL_BTN").addClass("imgbtn_block");
    
    if (NbItem == 0) {
      $("#DEL_ALL").addClass("imgbtn_block");
    }

  }

});

$("#DEL_ALL").click(function() {  
  if (NbItem != 0) {
    var r = confirm("Etes vous sur de vouloir tout supprimer ?");
    if (r == true) {

      //On deselectionne (au cas ou)
      Selected = null;

      //del tout les items
      $(".item").each(function( index ) {
        jsPlumb.remove($( this ));
      });
      
      //$(".item").remove();
      
      //On bloque les boutons
      $("#DEL_ALL").addClass("imgbtn_block");
      $("#DEL_BTN").addClass("imgbtn_block");

      //Actualisation du nombre d'item
      NbItem = 0;

      //Actualisation des Noms déja utilisés
      HostUsed = [];
    }
  }
});






///////////////////
////  MODELE  ////
/////////////////

$(".model").draggable({
  //Duplication de l'élément
  helper:"clone", 

  //On l'ajoute à la zone de travail
  appendTo:".workspace",

  //On bloque ces déplacements dans la div parente
  containment: 'parent',
  
  //Quand on commence à deplacer le modèle de la sidebar
  start: function(e){
    
    //On met le curseur en mode déplacement
    $(this).css("cursor","move");
    
    //On change le titre de la fenêtre POPUP
    var type = $(this).find("#Title").text();
    $("#ModalCreate").find(".modal-title").html("<strong>Création " + type + "</strong>");
  },


  //Quand on a fini de deplacer le modèle de la sidebar
  stop: function(e,ui){

    //Retour au curseur normal
    $(this).css("cursor","");
  }
});








///////////////////////////////////////////////
//// TRAITER LA VALIDATION DU FORMULAIRE  //// 
/////////////////////////////////////////////


$(function() {

  //Quand le bouton submit est appuyé
  $('#form_create').on('submit', function(e) {
    //on annule les actions par default
    e.preventDefault();  

    //Si la valeur du champ hostname est remplie
    if( $('#form_create').find('input[name="hostname"]').val() ) {

      //On récupère les valeurs
      var HOST = $('#form_create').find('input[name="hostname"]').val();
      var NB_INTER = $('#form_create').find('select[name="nb"]').val();

      // On vérifie que le nom d'host est unique
      if(jQuery.inArray(HOST, HostUsed) == -1) {
        
        //On vide le contenu dans le formulaire
        $('#form_create').find('input[name="hostname"]').val("");
        $('#form_create').find('select[name="nb"]').val("1");
        
        //Traitement

          //Edit du nom
          ItemEnCoursDeCreation.find("p").text(HOST);

          //On stocke le nombre d'interfaces
          ItemEnCoursDeCreation.attr("nbInter", NB_INTER);


          //On creer les interfaces
          for (var i = 0; i<NB_INTER; i++) {

            jsPlumb.addEndpoint(ItemEnCoursDeCreation, {
              endpoint:"Dot",
              isSource: true,
              isTarget: true,
              parameters:{
                  "interface":"eth"+i,
                  "host":HOST,
                  "type":ItemEnCoursDeCreation.attr("type")
              },
              maxConnections: 1,
              paintStyle:{ fill:"gray", outlineStroke:"dark", strokeWidth:10 },
              connectorPaintStyle:{ fill:"blue", strokeStyle:"lightblue", lineWidth:10 },
              anchor: [1, i/NB_INTER + 1/(2*NB_INTER), 1, 0],
              connector: [ "StateMachine", {
                margin: 10,
                curviness: 50
              }]
             })
            .addOverlay(["Label", {
                 label:"eth"+i,
                 location:0.5,
                 id:"label",
                 cssClass:"aLabel"
             } ]);
          }

          HostUsed.push(HOST);

          console.log(HostUsed);

          //On autorise le drag & drop
          jsPlumb.draggable(ItemEnCoursDeCreation);

          ItemEnCoursDeCreation=null;

        //Fin Traitement


        
        
        //On cache le POPUP
        EditEnCour=false;
        $("#ModalCreate").modal('hide');
        $("#ModalCreate #Error").text("");

        //On active le bouton delete all s'il ne l'etait pas
        if (NbItem == 0) {
          $("#DEL_ALL").removeClass("imgbtn_block");
        }

        //Actualisation du nb d'item
        NbItem +=1;
      }
      else {
        //Le nom d'host est déja utilisé -> erreur
        $("#ModalCreate #Error").text("Le nom d'Host est déja utilisé..");
      }

    }

    else {
      //Le nom d'host n'est pas donné -> erreur
      $("#ModalCreate #Error").text("Vous devez donner un nom d'Host Valide..");
    }

  });

});





////////////////////////////////////////////////////////////
////  TRAITER LA FERMETURE DU FORMULAIRE (annulation)  ////
//////////////////////////////////////////////////////////

$('#ModalCreate').on('hidden.bs.modal', function () {
  if (EditEnCour) {
    ItemEnCoursDeCreation.remove();
    ItemEnCoursDeCreation = null;
    $("#ModalCreate #Error").text("");
  }
})


///////////////////////////////////////////////////////
////  TRAITER LE FOCUS AUTO SUR LA ZONE DE TEXTE  ////
/////////////////////////////////////////////////////

$('#ModalCreate').on('shown.bs.modal', function () {
    $('#InputHostName').focus();
})  




///////////////////////////////////////////////////////////
////  PARAMETRAGE DU CONTENT (RECEPTION DES MODELES)  ////
/////////////////////////////////////////////////////////


$("#content").droppable(
{
  accept:".model",
  drop: function(event, ui){
    var item = $(ui.helper).clone();
    ItemEnCoursDeCreation = item;
    EditEnCour = true;
    var pzmatrix = $panzoom.panzoom("getMatrix");
    var currentScale = pzmatrix[0];
    var dx = pzmatrix[4];
    var dy = pzmatrix[5];
    var pzoff = $panzoom.offset();
    item.attr('class', 'item ui-draggable ui-draggable-handle noselect');
    item.click(function() {
      Selected  = item;
      $(".item").removeClass("selected");
      item.addClass("selected");

      //On active le bouton Delete
      $("#DEL_BTN").removeClass("imgbtn_block");

    });
    item.draggable({
      //containment: $(".panzoom"),
      //containment: $("#content"),
      start: function(e){
        $(this).css("cursor","move");
        $panzoom.panzoom("disable");
      },
      drag:function(e,ui){
        currentScale = $panzoom.panzoom("getMatrix")[0];
        ui.position.left = ui.position.left/currentScale;
        ui.position.top = ui.position.top/currentScale;
        if($(this).hasClass("jsplumb-connected"))
        {
          plumb.repaint($(this).attr('id'),ui.position);
        }
      },
      stop: function(e,ui){
        var nodeId = $(this).attr('id');
        if($(this).hasClass("jsplumb-connected"))
        {
          plumb.repaint(nodeId,ui.position);
        }
        $(this).css("cursor","");
        $panzoom.panzoom("enable");
      }});
    console.log(currentScale,pzoff);
    var newPos = {
      top:(ui.offset.top - pzoff.top)/currentScale,
      left:(ui.offset.left - pzoff.left)/currentScale,
    };
    item.css(newPos);
    item.find("table").removeClass("ModelTBL");
   
    $panzoom.append(item);


    // Si ce n'est pas un switch on ouvre le POPUP
    if (item.attr("type") != "Switch") {
      $("#ModalCreate").modal('show');
    }


    //Sinon on creer le switch directement
    else {

      SwitchNB += 1;

      //Tant que le nom est utilisé on incrémente le numéro du switch
      while ($.inArray("Switch"+SwitchNB, HostUsed) != -1) {
        SwitchNB += 1;
      }

      //Edit du nom du Switch
      ItemEnCoursDeCreation.find("p").text("Switch"+SwitchNB);

      //On stocke le nombre d'interfaces
      ItemEnCoursDeCreation.attr("nbInter", NB_INTER_Switch);

      ItemEnCoursDeCreation.css("padding-left", "5em");
      ItemEnCoursDeCreation.css("padding-right", "5em");
      ItemEnCoursDeCreation.css("padding-top", "1em");
      ItemEnCoursDeCreation.css("padding-bottom", "1em");

      //On creer les interfaces
      for (var y = 0; y<2; y++) {
        for (var i = 0; i<(NB_INTER_Switch/2); i++) {

        jsPlumb.addEndpoint(ItemEnCoursDeCreation, {
          endpoint:"Dot",
          isSource: true,
          isTarget: true,
          parameters:{
              "interface":"eth"+i,
              "host":"Switch"+SwitchNB,
              "type":ItemEnCoursDeCreation.attr("type")
          },
          maxConnections: 1,
          paintStyle:{ fill:"gray", outlineStroke:"dark", strokeWidth:10 },
          connectorPaintStyle:{ fill:"blue", strokeStyle:"lightblue", lineWidth:10 },
          anchor: [ i/(NB_INTER_Switch/2) + 1/NB_INTER_Switch, y, 1, 0],
          connector: [ "StateMachine", {
            margin: 10,
            curviness: 50
          }]
         });

        }
      }
      
      HostUsed.push("Switch"+SwitchNB);

      //On autorise le drag & drop
      jsPlumb.draggable(ItemEnCoursDeCreation);

      ItemEnCoursDeCreation=null;

      //On active le bouton delete all s'il ne l'etait pas
      if (NbItem == 0) {
        $("#DEL_ALL").removeClass("imgbtn_block");
      }

      //Actualisation du nb d'item
      NbItem +=1;

    }
    

  }
});






////////////////////////////////////
////  Paramétrages du PANZOOM  ////
//////////////////////////////////


$panzoom.parent().on('mousewheel', function(e) {
  e.preventDefault();
  
  //On active le bouton reset view
  $("#VIEW_BTN").removeClass("imgbtn_block");

  var delta = e.delta || e.originalEvent.wheelDelta;
  var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
  $panzoom.panzoom('zoom', zoomOut, {
    increment: 0.1,
    focal: e
  });
  jsPlumb.setZoom($panzoom.panzoom("getMatrix")[0]);
})
.on("mousedown touchstart",function(ev){  
  var matrix = $container.find(".panzoom").panzoom("getMatrix");
  var offsetX = matrix[4];
  var offsetY = matrix[5];
  var dragstart = {x:ev.pageX,y:ev.pageY,dx:offsetX,dy:offsetY};
  $(ev.target).css("cursor","move");
  $(this).data('dragstart', dragstart);
  
})
.on("mousemove touchmove", function(ev){
  var dragstart = $(this).data('dragstart');
  
  if(dragstart)
  {

    var deltaX = dragstart.x-ev.pageX;
    var deltaY = dragstart.y-ev.pageY;
    var matrix = $panzoom.panzoom("getMatrix");
    matrix[4] = parseInt(dragstart.dx)-deltaX;
    matrix[5] = parseInt(dragstart.dy)-deltaY;
    $panzoom.panzoom("setMatrix",matrix);
  }
})
.on("mouseup touchend touchcancel", function(ev){
  $(this).data('dragstart',null);
  $(ev.target).css("cursor","");

  //On active le bouton reset view
  $("#VIEW_BTN").removeClass("imgbtn_block");

  //On deselectionne
  Selected  = null;
  $(".item").removeClass("selected");

  //On desactive le bouton Delete
  $("#DEL_BTN").addClass("imgbtn_block");

});







/////////////////////
////  JSPLUMBS  ////
///////////////////

jsPlumb.ready(function() {

  //Executé lors d'une connexion de lien
  jsPlumb.bind("connection", function(info) {
    console.log(info.connection);
/*
    console.log(info.connection.endpoints[0].getParameter("interface"));
    console.log(info.connection.endpoints[0].getParameter("type"));
    console.log(info.connection.endpoints[1].getParameter("host"));
    console.log(info.connection.endpoints[1].getParameter("interface"));
    console.log(info.connection.endpoints[1].getParameter("type"));
    console.log(info);*/
    if (info.connection.endpoints[0].getParameter("type") == "Switch" && info.connection.endpoints[1].getParameter("type") == "Switch") {
        return false;
    }
    else {
        return true;
    }
  });


  //Executé lors d'une déconnexion de lien
  jsPlumb.bind("connectionDetached", function(info) {
    /*console.log("detach");*/
  });


  //On empêche une auto connexion 
  jsPlumb.bind("beforeDrop", function (info) {
    if (info.sourceId === info.targetId) { //source and target ID's are same
        console.log("source and target ID's are the same - self connections not allowed.")
        return false;
    } 
    else {
        return true;
    }
  });

});
