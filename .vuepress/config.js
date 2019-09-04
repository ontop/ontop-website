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
				text: 'Academia',
				link: '/academia/'
			},
		],
		sidebar: {
			'/guide/': genGuideSidebarConfig('Guide'),
			'/dev/': genDevSidebarConfig('Development'),
			'/academia/': genAcademiaSidebarConfig('Academic corner'),
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
		  'query-nodes',
		]
	  }
	]
  }

function genAcademiaSidebarConfig (title) {
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
