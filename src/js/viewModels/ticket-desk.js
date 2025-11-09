define(["knockout", "ojs/ojarraydataprovider"], function (
  ko,
  ArrayDataProvider
) {
  function TicketDeskViewModel() {
    const self = this;

    // 🔹 Campo de búsqueda (todavía no filtra)
    self.searchValue = ko.observable("");

    // 🔹 Datos iniciales (mock local o mock server)
    self.tickets = ko.observableArray([]);

    // 🔹 TICKET LIST - Lista de tickets
    self.ticketList = self.tickets;

    // 🔹 Proveedor de datos para ojListView
    self.ticketDataProvider = new ArrayDataProvider(self.tickets, {
      keyAttributes: "id",
    });

    // 🔹 TICKET SELECTION - Variables de selección de tickets
    self.selectedTicket = ko.observableArray([]);
    self.selectedTicketModel = ko.observable();
    self.selectedTicketRepId = ko.observable();

    self.selectedTicketTitle = ko.pureComputed(() => {
      const selected = self
        .tickets()
        .find((t) => t.id === self.selectedTicket()[0]);
      return selected ? selected.title : "Select a ticket...";
    });

    // 🔹 LIST SELECTION CHANGED - Evento cuando cambia selección de ticket
    self.listSelectionChanged = function () {
      // 🎯 Obtener modelo del ticket seleccionado usando find
      var selectedId = self.selectedTicket()[0];
      var ticketModel = self.ticketList().find(function(ticket) {
        return ticket.id === selectedId;
      });
      self.selectedTicketModel(ticketModel);
      
      // 🎯 Verificar si el ticket ya está en los tabs
      var match = ko.utils.arrayFirst(self.tabData(), function (item) {
        return item.id == selectedId;
      });

      // 🎯 Si no existe, agregarlo a los tabs
      if (!match) {
        self.tabData.push({
          "name": selectedId,
          "id": selectedId
        });
      }

      // 🎯 Establecer ID del representante y pestaña seleccionada
      if (ticketModel) {
        self.selectedTicketRepId(ticketModel.representativeId);
      }
      self.selectedTabItem(selectedId);
    };

    // 🔹 Tab Component Data - Inicialmente vacío, se llena al seleccionar tickets
    self.tabData = ko.observableArray([]);

    self.tabBarDataSource = new ArrayDataProvider(self.tabData, {
      keyAttributes: "id"
    });

    // 🔹 Tab seleccionado - Inicialmente vacío
    self.selectedTabItem = ko.observable();

    // 🔹 Función para eliminar tabs
    self.deleteTab = function (id) {
      var hnavlist = document.getElementById("ticket-tab-bar"),
        items = self.tabData();
      for (var i = 0; i < items.length; i++) {
        if (items[i].id === id) {
          self.tabData.splice(i, 1);
          oj.Context.getContext(hnavlist)
            .getBusyContext()
            .whenReady()
            .then(function () {
              hnavlist.focus();
            });
          break;
        }
      }
    };

    // 🔹 Manejador para remover tabs
    self.onTabRemove = function (event) {
      self.deleteTab(event.detail.key);
      event.preventDefault();
      event.stopPropagation();
    };

    // 🔹 CARGAR DATOS - Cargar datos desde el servidor mock DESPUÉS de crear observables
    fetch("http://localhost:8085/tickets")
      .then((res) => res.json())
      .then((data) => {
        console.log("📋 Tickets cargados:", data.tickets);
        self.tickets(data.tickets);
      })
      .catch((err) => console.error("❌ Error loading tickets:", err));
  }

  return new TicketDeskViewModel();
});
