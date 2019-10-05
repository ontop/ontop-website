module.exports = {
	base: '/',
	title: 'Ontop',
	themeConfig: {
		repo: 'ontop/ontop',
		docsRepo: 'ontop/ontop-website',
		editLinks: true,
		lastUpdated: 'Last Updated',
		nav: [
			{
			  text: 'Guide',
			  link: '/guide/',
			},
			{
				text: 'Tutorial',
				link: '/tutorial/',
			  },
			{
				text: 'Dev',
				link: '/dev/'
			},
			{
				text: 'Research',
				link: '/research/'
			},
			{
				text: 'Community',
				link: '/community/'
			},
			{
				text: 'Jobs',
				link: '/community/jobs/'
			},
		],
		sidebar: {
			'/guide/': genGuideSidebarConfig(),
			'/tutorial/': genTutorialSidebarConfig(),
			'/dev/': genDevSidebarConfig(),
			'/community/': genCommunitySidebarConfig(),
			'/research/': genResearchSidebarConfig(),
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

function genGuideSidebarConfig () {
	return [
	  {
		title: 'Guide',
		collapsable: false,
		children: [
		  '',
		  'getting-started',
		  'concepts',
		  'materialization',
		]
	  },
	  {
		title: 'Advanced',
		collapsable: false,
		children: [
		]
	  },
	  {
		title: 'Troubleshooting',
		collapsable: false,
		children: [
			'troubleshooting/known-issues',
			'troubleshooting/faq'
		]
	  },
	  {
		title: 'Meta',
		collapsable: false,
		children: [
		  'glossary'
		]
	  }
	]
  }

function genDevSidebarConfig () {
	return [
	  {
		title: 'Development',
		collapsable: false,
		children: [
		  '',
		]
	  },
	  {
		title: 'Internals',
		collapsable: false,
		children: [
		  'iq',
		]
	  }
	]
  }

  function genTutorialSidebarConfig () {
	return [
	  {
		title: 'Tutorial',
		collapsable: false,
		children: [
		  '',
		]
	  }
	]
  }

function genCommunitySidebarConfig () {
	return [
	  {
		title: 'Community',
		collapsable: false,
		children: [
		  '',
		  'organizations',
		  'support',
		]
	  },
	  {
		title: 'Contributing',
		collapsable: false,
		children: [
			'contributing/',
			'contributing/bug-report',
			'contributing/pull-request',
		  'contributing/documentation',
		  'contributing/jobs'
		]
	  }
	]
  }


function genResearchSidebarConfig () {
	return [
	  {
		title: 'Research',
		collapsable: false,
		children: [
		  '',
		  'publications',
		]
	  },
	  {
		title: 'Theory',
		collapsable: false,
		children: [
		  'notation',
		  'iq-formal',
		  'optimization',
		]
	  }
	]
  }
