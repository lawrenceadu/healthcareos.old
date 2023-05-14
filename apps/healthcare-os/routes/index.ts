const routes = {
  auth: {
    login: '/login',
    otp: '/otp',
    forgotten: '/forgotten-password',
    reset: '/reset-password',
    facility: '/facility',
  },

  dashboard: {
    dashboard: {
      index: '/dashboard/[tab]',
    },
    patients: {
      index: '/patients',
      new: '/patients/new',
      search: '/patients/search',
      card: {
        activate: '/patients/card/activate/[id]',
      },
      details: {
        index: '/patients/[id]/details/[tab]',
        info: '/patients/[id]/info',
        edit: '/patients/[id]/edit',
      },
    },
    inventory: {
      index: '/inventory/[tab]',
    },
    pharmacy: {
      index: '/pharmacy/[tab]',
    },
    investigations: {
      index: '/investigations',
    },
    queuing: {
      index: '/queuing',
    },
    wards: {
      index: '/wards',
      details: '/wards/details/[id]',
    },
    settings: {
      index: '/settings/[tab]',
    },
    invoices: {
      index: '/invoices',
    },
    resources: {
      index: '/resources/[tab]',
    },

    members: {
      index: '/members/[tab]',
    },
  },
};

export default routes;
