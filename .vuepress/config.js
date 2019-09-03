module.exports = {
	base: '/ontop-docs/',
	title: 'Ontop',
	themeConfig: {
		lastUpdated: 'Last Updated',
		nav: [
			{
			  text: 'Guide',
			  link: '/guide/',
			},
			{
				text: 'Github',
				link: 'https://github.com/ontop/ontop'
			},
		],
		sidebar: {
			'/guide/': genSidebarConfig('Guide')
		}
	}
}

function genSidebarConfig (title) {
	return [
	  {
		title,
		collapsable: false,
		children: [
		  '',
		  'getting-started',
		]
	  }
	]
  }
