declare module 'leaflet-routing-machine' {
  import { Control } from 'leaflet';
  
  namespace Routing {
    interface RoutingControlOptions {
      waypoints: any[];
      routeWhileDragging?: boolean;
      showAlternatives?: boolean;
      lineOptions?: any;
      createMarker?: () => any;
      addWaypoints?: boolean;
      draggableWaypoints?: boolean;
      fitSelectedRoutes?: boolean;
      show?: boolean;
    }
    
    function control(options: RoutingControlOptions): Control;
  }
  
  export = Routing;
}
