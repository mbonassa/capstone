function requireAuth(nextState, replace) {
    const key = Object.keys(localStorage).find(e => e.match(/firebase:authUser/));
    const data = JSON.parse(localStorage.getItem(key));
    if (data == null) {
        replace({
            pathname: '/login',
            state: {
                nextPathname: nextState.location.pathname,
            },
        });
    }
}

firebaseAuth.onAuthStateChanged(user => {
      console.log("THE AUTH STATE CHANGED");
      console.log(user)
      if (user){
      this.props.navigation ? this.props.navigation.navigate(('Profile', { name: 'Jane' })) : console.log("no props received")

      }
    });

module.exports = requireAuth;
