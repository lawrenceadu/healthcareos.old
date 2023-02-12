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
      in: {
        index: '/patients/in/[slug]',
      },
      out: {
        index: '/patients/out/[slug]',
      },
      card: {
        activate: '/patients/card/activate/[slug]',
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
