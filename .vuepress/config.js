module.exports = {
	base: '/ontop-docs/',
	title: 'Ontop',
	themeConfig: {
		repo: 'ontop/ontop',
		docsRepo: 'ontop/ontop-docs-src',
		editLinks: true,
		lastUpdated: 'Last Updated',
		nav: [
			{
			  text: 'Guide',
			  link: '/guide/',
			},
			{
				text: 'Glossary',
				link: '/glossary/',
			},
			{
				text: 'Dev',
				link: '/dev/'
			},
			{
				text: 'Research',
				link: '/research/'
			},
		],
		sidebar: {
			'/guide/': genGuideSidebarConfig('Guide'),
			'/dev/': genDevSidebarConfig('Development'),
			'/research/': genResearchSidebarConfig('Research'),
		}
	},
	plugins: [
		['mathjax', {
		  target: 'svg',
		  macros: {
			'*': '\\times',
		  },
		}],
	  ]
}

function genGuideSidebarConfig (title) {
	return [
	  {
		title,
		collapsable: false,
		children: [
		  '',
		  'getting-started',
		  'concepts',
		  'materialization',
		]
	  }
	]
  }

function genDevSidebarConfig (title) {
	return [
	  {
		title,
		collapsable: false,
		children: [
		  '',
		  'iq',
		]
	  }
	]
  }

function genResearchSidebarConfig (title) {
	return [
	  {
		title,
		collapsable: false,
		children: [
		  '',
		  'notation',
		  'iq-formal',
		  'optimization',
		]
	  }
	]
  }
