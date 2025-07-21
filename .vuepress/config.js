module.exports = {
    base: '/',
    title: 'Ontop',
    markdown: {
	    externalLinks: {
		    target: '_blank', 
		    rel: 'noopener' 
	    }
    },
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
                text: 'Download',
                link: '/download/'
            },
            {
                text: 'Community',
                link: '/community/'
            },
            {
                text: 'Research',
                link: '/research/'
            },
            {
                text: 'Dev',
                link: '/dev/'
            },
            {
                text: 'Work with us',
                link: '/jobs/'
            }
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
        ["vuepress-plugin-matomo",
            {
                'siteId': 2,
                'trackerUrl': "https://ontopic.matomo.cloud/"
            }
        ],
        ["redirect", {
            redirectors: [
                {
                    base: '/obda-pages/ontop',
                    storage: false,
                    alternative: [
                        '../..',
                    ],
                },
                {
                    base: '/download',
                    storage: false,
                    alternative: [
                        '../guide/getting-started',
                    ],
                },
            ],
        },
        ]
    ]
}

function genGuideSidebarConfig() {
    return [
        {
            title: 'Guide',
            collapsable: false,
            children: [
                '',
                'concepts',
                'getting-started',
                'cli',
                'compliance'
            ]
        },
          {
        	title: 'Advanced',
        	collapsable: false,
        	children: [
                'advanced/mapping-language',
                'advanced/predefined',
                'advanced/logging',
                'advanced/caching',
                'advanced/configuration',
                'advanced/lenses'
        	]
          },
        {
            title: 'Data sources',
            collapsable: true,
            children: [
                'databases/generic.md',
                'databases/athena.md',
                'databases/dynamodb.md',
                'databases/redshift.md',
                'databases/databricks.md',
                'databases/db2.md',
                'databases/denodo.md',
                'databases/dremio.md',
                'databases/duckdb.md',
                'databases/bigquery.md',
                'databases/h2.md',
                'databases/mariadb.md',
                'databases/mssql.md',
                'databases/mysql.md',
                'databases/oracle.md',
                'databases/postgres.md',
                'databases/presto.md',
                'databases/snowflake.md',
                'databases/spark.md',
                'databases/trino.md',
            ]
        },
        {
            title: 'Troubleshooting',
            collapsable: false,
            children: [
                'troubleshooting/faq'
            ]
        },
        {
            title: 'Meta',
            collapsable: false,
            children: [
                'glossary',
                'releases'
            ]
        },
    ]
}

function genDevSidebarConfig() {
    return [
        {
            title: 'Development',
            collapsable: false,
            children: [
                '',
                'git',
                'build',
                'new-release',
                'snapshot',
                'debug-protege',
                'debug-jetty',
                'db-adapter',
                'stats'
            ]
        },
        {
            title: 'Internals',
            collapsable: false,
            children: [
                'internals/iq',
		'internals/guice'
            ]
        },
        {
            title: 'Outdated corner',
            children: [
                'outdated/known-issues',
            ]
        }
    ]
}

function genTutorialSidebarConfig() {
    return [
        {
            title: 'Tutorial',
            collapsable: false,
            children: [
                '',
            ]
        },
        {
            title: 'Basics',
            collapsable: false,
            children: [
                'basic/setup',
                'basic/university-1',
                'basic/university-2',
            ]
        },
        {
            title: 'Endpoint',
            collapsable: false,
            children: [
                'endpoint/',
                'endpoint/endpoint-cli',
                'endpoint/endpoint-docker',
                //'endpoint/endpoint-tomcat',
            ]
        },
        {
            title: 'Interact',
            collapsable: false,
            children: [
                'interact/cli.md',
                'interact/jupyter.md',
            ]
        },
        {
            title: 'Mapping',
            collapsable: false,
            children: [
                'mapping/',
                'mapping/primary-keys',
                'mapping/foreign-keys',
                'mapping/uri-templates',
                'mapping/existential',
            ]
        },
	{
            title: 'Materialize',
            collapsable: false,
            children: [
                'materialization/materialization.md'
            ]
        },
        {
            title: 'Federation',
            collapsable: false,
            children: [
                'federation/',
                'federation/denodo/',
                'federation/dremio/',
		'federation/teiid/'
            ]
        },  
        {
            title: 'Lenses',
            collapsable: false,
            children: [
                'lenses/',
                'lenses/setup',
                'lenses/basic-lens',
                'lenses/join-lens',
                'lenses/union-lens',
                'lenses/flatten-lens',
                'lenses/sql-lens',
            ]
        },
        {
            title: 'Others',
            collapsable: false,
            children: [
                'external-tutorials'
            ]
        }
        /*{
          title: 'Api',
          collapsable: false,
          children: [
              'api/',
          ]
        }*/

    ]
}

function genCommunitySidebarConfig() {
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
                'contributing/documentation'
            ]
        }
    ]
}


function genResearchSidebarConfig() {
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
