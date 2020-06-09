import defaultSettings from '@/settings'

const title = defaultSettings.title || '优行'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
