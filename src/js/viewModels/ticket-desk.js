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

    // Cargar datos desde el servidor mock
    fetch("http://localhost:8085/tickets")
      .then((res) => res.json())
      .then((data) => self.tickets(data.tickets))
      .catch((err) => console.error("Error loading tickets:", err));

    // 🔹 Proveedor de datos para ojListView
    self.ticketDataProvider = new ArrayDataProvider(self.tickets, {
      keyAttributes: "id",
    });

    // 🔹 Ticket seleccionado
    self.selectedTicket = ko.observable();
    self.selectedTicketTitle = ko.pureComputed(() => {
      const selected = self
        .tickets()
        .find((t) => t.id === self.selectedTicket());
      return selected ? selected.title : "Select a ticket...";
    });

    // 🔹 Tab Component Data
    self.tabData = ko.observableArray([
      {
        name: "Settings",
        id: "settings"
      },
      {
        name: "Tools",
        id: "tools"
      },
      {
        name: "Base",
        id: "base"
      },
      {
        name: "Environment",
        disabled: "true",
        id: "environment"
      },
      {
        name: "Security",
        id: "security"
      }
    ]);

    self.tabBarDataSource = new ArrayDataProvider(self.tabData, {
      keyAttributes: "id"
    });

    // 🔹 Tab seleccionado
    self.selectedTabItem = ko.observable("settings");

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
  }

  return new TicketDeskViewModel();
});
