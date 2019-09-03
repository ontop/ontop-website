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
	}
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
		  'iq-dev',
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
		  'iq/iq-nodes',
		  'iq/iq-formal',
		  'optimization',
		]
	  }
	]
  }
