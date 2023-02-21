const routes = {
  auth: {
    login: '/login',
    otp: '/otp',
    forgotten: '/forgotten-password',
    reset: '/reset-password',
  },

  dashboard: {
    patients: {
      index: '/patients',
      new: '/patients/new',
      search: '/patients/search',
      card: {
        activate: '/patients/card/activate/[slug]',
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
    queuing: {
      index: '/queuing',
    },
    wards: {
      index: '/wards',
      details: '/wards/details/[slug]',
    },
    settings: {
      index: '/settings/[tab]',
    },
  },
};

export default routes;
