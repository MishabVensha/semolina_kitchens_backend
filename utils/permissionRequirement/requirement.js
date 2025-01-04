const ExtractRequiredPermission = (routeName) => {
  switch (routeName) {
    // user modules
    case "/add-user":
      return "user_create";
    case "/update-user":
      return "user_edit";
    case "/update-user-profile":
      return "user_edit";
    case "/list-user":
      return "user_view";
    case "/list-user-profile":
      return "user_view";
    case "/list-user-logs":
      return "user_view";
    case "/change-password":
      return "user_edit";
    case "/update-user-profile":
      return "user_edit";
    case "/admin-change-password":
      return "user_edit";
    case "/user-logs":
      return "user_edit";

    // role modules
    case "/add-role":
      return "role_create";
    case "/update-role":
      return "role_edit";
    case "/list-role":
      return "role_view";
    case "/list-role-logs":
      return "role_view";

    // material modules
    case "/add-material-master":
      return "material_master_create";
    case "/bulk-upload-material":
      return "material_master_create";
    case "/update-material-master":
      return "material_master_edit";
    case "/list-material-master":
      return "material_master_view";

    // crossDocker modules
    case "/add-cross-dock-master":
      return "cross_dock_master_create";
    case "/update-cross-dock-master":
      return "cross_dock_master_edit";
    case "/list-cross-dock-master":
      return "cross_dock_master_view";

    // pallete modules

    case "/add-pallete-master":
      return "pallete_master_create";
    case "/bulk-upload-pallete-master":
      return "pallete_master_create";
    case "/update-pallete-master":
      return "pallete_master_edit";
    case "/list-pallete-master":
      return "pallete_master_view";

    // Production Line modules

    case "/add-produntion-line-master":
      return "production_line_master_create";
    case "/bulk-upload-produntion-line-master":
      return "production_line_master_create";
    case "/update-produntion-line-master":
      return "production_line_master_edit";
    case "/list-produntion-line-master":
      return "production_line_master_view";

    // CustomerType  modules

    case "/add-customer-type-master":
      return "customer_type_master_create";
    case "/bulk-upload-customer-type-master":
      return "customer_type_master_create";
    case "/update-customer-type-master":
      return "customer_type_master_edit";
    case "/list-customer-type-master":
      return "customer_type_master_view";

    case "/add-inbound":
      return "material_master_create";
    case "/list-vendor":
      return "vendor_master_view";
    case "/update-inbound":
      return "material_master_edit";
    case "/list-inbound":
      return "role_view";

    case "/add-storage-type":
      return "storage_type_master_create";
    case "/list-vendor":
      return "storage_type_master_view";
    case "/update-storage-type":
      return "storage_type_master_edit";
    case "/list-storage-type":
      return "storage_type_master_view";

    case "/add-storage-search":
      return "storage_search_master_create";
    case "/list-vendor":
      return "storage_search_master_view";
    case "/update-storage-search":
      return "storage_search_master_edit";
    case "/list-storage-search":
      return "storage_search_master_view";

    case "/add-vendor":
      return "vendor_master_create";
    case "/list-vendor":
      return "vendor_master_view";
    case "/update-vendor":
      return "vendor_master_edit";

    case "/add-outbound":
      return "outbound_master_create";
    case "/list-outbound-so":
      return "outbound_master_view";
    case "/list-outbound-sto":
      return "outbound_master_view";
    case "/update-outbound":
      return "outbound_master_edit";

    case "/add-truck-loading":
      return "truck_loading_create";
    case "/list-truck-loading":
      return "truck_loading_view";
    case "/update-truck-loading":
      return "truck_loading_edit";

    case "/add-bin":
      return "bin_master_create";
    case "/list-bin":
      return "bin_master_view";
    case "/update-bin":
      return "bin_master_edit";

    case "/add-delivery":
      return "delivery_create";
    case "/list-delivery":
      return "delivery_view";
    case "/update-delivery":
      return "delivery_edit";

    case "/add-uom":
      return "uom_master_create";
    case "/list-uom":
      return "uom_master_view";
    case "/update-uom":
      return "uom_master_edit";

    case "/add-auom":
      return "auom_master_create";
    case "/list-auom":
      return "auom_master_view";
    case "/update-auom":
      return "auom_master_edit";

    case "/add-inbound-gate-entry":
      return "security_create";
    case "/list-inbound-gate-entry":
      return "security_view";
    case "/update-inbound-gate-entry":
      return "security_edit";

    case "/add-outbound-gate-entry":
      return "security_create";
    case "/list-outbound-gate-entry":
      return "security_view";
    case "/update-outbound-gate-entry":
      return "security_edit";

    case "/add-bin-type":
      return "bin_type_master_create";
    case "/list-bin-type":
      return "bin_type_master_view";
    case "/update-bin-type":
      return "bin_type_master_edit";

    case "/add-customer":
      return "customer_master_create";
    case "/list-customer":
      return "customer_master_view";
    case "/update-customer":
      return "customer_master_edit";

    case "/add-vehicle":
      return "vehicle_master_create";
    case "/list-vehicle":
      return "vehicle_master_view";
    case "/update-vehicle":
      return "vehicle_master_edit";

    case "/add-loading":
      return "loading_master_create";
    case "/list-loading":
      return "loading_master_view";
    case "/update-loading":
      return "loading_master_edit";

    case "/add-production":
      return "production_master_create";
    case "/list-production":
      return "production_master_view";
    case "/production-report":
      return "production_master_view";
    case "/get-all-forklift-task-count":
      return "production_master_view";
    case "/get-all-status-count":
      return "production_master_view";
    case "/verify-bin":
      return "production_master_edit";
    case "/update-production":
      return "production_master_edit";
    case "/update-partial-to-delete-production":
      return "production_master_edit";

    case "/list-stock-table":
      return "stock_report_view";
    case "/list-transaction":
      return "transfer_order_view";

    case "/add-unloading":
      return "unloading_master_create";
    case "/list-unloading":
      return "unloading_master_view";
    case "/update-unloading":
      return "unloading_master_edit";

    case "/add-forklift-operator":
      return "forklift_operator_master_create";
    case "/list-forklift-operator":
      return "forklift_operator_master_view";
    case "/list-forklift-operator-outbound":
      return "forklift_operator_master_view";
    case "/update-forklift-operator":
      return "forklift_operator_master_edit";
    case "/verify-bin":
      return "forklift_operator_master_edit";

    default:
      return null;
  }
};
export { ExtractRequiredPermission };
