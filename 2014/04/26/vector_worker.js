importScripts('vector-map-worker.min.js');
var VectorWorker = {};
VectorWorker.worker = this;
VectorWorker.tiles = {};
GLBuilders.setTileScale(VectorRenderer.tile_scale);
// Load tile
VectorWorker.worker.addEventListener('message', function (event) {
    if (event.data.type != 'loadTile') {
        return;
    }
    var tile = event.data.tile;
    var renderer_type = event.data.renderer_type;
    var tile_source = event.data.tile_source;
    tile_source = TileSource.create(tile_source.type, tile_source.url, tile_source);

    VectorWorker.layers = VectorWorker.layers || VectorRenderer.loadLayers(event.data.layer_source);
    VectorWorker.styles = VectorWorker.styles || VectorRenderer.loadStyles(event.data.style_source);

    VectorWorker.tiles[tile.key] = tile;

    tile_source.loadTile(tile, VectorWorker, function () {
        // Extract desired layers from full GeoJSON
        VectorRenderer.processLayersForTile(VectorWorker.layers, tile);

        // Renderer-specific transforms
        tile.debug.rendering = +new Date();
        if (VectorRenderer[renderer_type].addTile != null) {
            VectorRenderer[renderer_type].addTile(tile, VectorWorker.layers, VectorWorker.styles);
        }
        tile.debug.rendering = +new Date() - tile.debug.rendering;

        VectorWorker.worker.postMessage({
            type: 'loadTileCompleted',
            tile: tile
        });
        delete VectorWorker.tiles[tile.key];
    });
});

// Remove tile
VectorWorker.worker.addEventListener('message', function (event) {
    if (event.data.type != 'removeTile') {
        return;
    }
    var key = event.data.key;
    var tile = VectorWorker.tiles[key];

    if (tile != null) {
        tile.loading = false;
        if (tile.xhr != null) {
            tile.xhr.abort();
        }
        delete VectorWorker.tiles[key];
    }
});
