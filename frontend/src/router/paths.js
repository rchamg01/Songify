/**
 * Define all of your application routes here
 * for more information on routes, see the
 * official documentation https://router.vuejs.org/en/
 */
export default [
  {
    path: '',
    // Relative to /src/views
    name: 'Track Search',
    view: 'trackSearch'
  },
  {
    path: '/audioFeatures',
    name: 'Audio Features',
    view: 'audioFeatures'
  }
]
