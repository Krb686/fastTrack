L.Control.CreateObject = L.Control.extend({
    options:{
        position: 'topleft'
    },
    
    onAdd: function (map) {
        var container = L.DomUtil.create('div', 'leaflet-createObject-control');
        
        return container;
    }
});

L.Map.mergeOptions({
    createObjectControl:true
});

L.Map.addInitHook(function () {
    if (this.options.createObjectControl){
        this.createObjectControl = new L.Control.CreateObject();
        this.addControl(this.createObjectControl);
    }
});

