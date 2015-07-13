module.exports = function (appName) {
	return {
		appName: appName,
		log: console.log.bind(console, appName, ':')
	};
}