import getMetaInfo from '../shared/getMetaInfo'
import generateServerInjector from './generateServerInjector'

export default function _inject (options = {}) {
  /**
   * Converts the state of the meta info object such that each item
   * can be compiled to a tag string on the server
   *
   * @this {Object} - Vue instance - ideally the root component
   * @return {Object} - server meta info with `toString` methods
   */
  return function inject () {
    // get meta info with sensible defaults
    const info = getMetaInfo(options)(this.$root)

    // Add og:title & twitter:title
    if (!info.meta.find(meta => meta.property === 'og:title')) {
      info.meta.push({ property: 'og:title', content: info.title })
    }
    if (!info.meta.find(meta => meta.name === 'twitter:title')) {
      info.meta.push({ name: 'twitter:title', content: info.title })
    }

    // Add og:description & twitter:description
    const description = info.meta.find(meta => meta.name === 'description')
    if (description) {
      if (!info.meta.find(meta => meta.property === 'og:description')) {
        info.meta.push({ property: 'og:description', content: description.content })
      }
      if (!info.meta.find(meta => meta.name === 'twitter:description')) {
        info.meta.push({ name: 'twitter:description', content: description.content })
      }
    }

    // Add og:image & twitter:image
    const image = info.meta.find(meta => meta.itemprop === 'image')
    if (image) {
      if (!info.meta.find(meta => meta.property === 'og:image')) {
        info.meta.push({ property: 'og:image', content: image.content })
      }
      if (!info.meta.find(meta => meta.name === 'twitter:image')) {
        info.meta.push({ name: 'twitter:image', content: image.content })
      }
    }

    // generate server injectors
    for (let key in info) {
      if (info.hasOwnProperty(key) && key !== 'titleTemplate' && key !== 'titleChunk') {
        info[key] = generateServerInjector(options)(key, info[key])
      }
    }

    return info
  }
}
