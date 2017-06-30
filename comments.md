# Code Review 1

## Workflow
	- What's in a good ticket?
	- User stories
		- As an[x] I want to [y] by [z]
	- Semantic commit messages:

	   - the type of commit (feature, test, fix, style, refactor, etc.)
	   - the subject of the committed code
	   - a present-tense description of what the commited code does 

## Back-End
	- Unclear how RESTful API for auth and firebase interact
	- empty git-linked firebones repo (that can't be cloned)
	- Great type signatures for firebase.js
	- Validate ya damn firebase secrets!

## Front-end
	- Don't love surrounding div where React app is mounted in a col-lg-12. Either use a container class or nothing! 
	- Bootstrap is a really fat dependency that is being pulled of a CDN before the app renders. How can we optimize this?
	- More consistent documentation - document firebase promises in components please!
	- More consistent formatting (eg, tabs vs spaces)
	- Refactor filters on FE to include firebase query (/lfg orderby child)
	- setState() is already immutable, so no need to use Object.assign() (EditProfile.js)
	- nice Currying for OnChange!
	- Profile.js is getting very hard to read, more docs/ make your code more semantic
	- Since this is redux-less, state changes seem to happen by pushing to browser history. Perhaps we can make this app less routey- and more traditionally stateful, either with redux or better nesting/containerizing of components
	- i dont love keeping index.scss at the root level. 

## Product
	- Better product scoping, are matches once a day or dynamic?
	- What happens when user runs away?
	- How are good matches identified/revealed?


