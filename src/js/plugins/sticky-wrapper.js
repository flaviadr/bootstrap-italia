/**
 * sticky-wrapper js lib
 * @ Fabio Fumis
 */
;(function() {
  const elWrappers = document.getElementsByClassName('sticky-wrapper')

  function isHidden(el) {
    const style = window.getComputedStyle(el)
    return style.display === 'none' || style.visibility === 'hidden'
  }

  const elToggler = document.querySelector('.custom-navbar-toggler')
  const isDesktop = isHidden(elToggler)

  let runCheckOnScroll = undefined

  if (elWrappers && elWrappers.length) {
    let isSticky = false

    const initSticky = isDesktop => {
      const getPadding = (parent, size) => {
        return isDesktop
          ? parseInt(
              (window.getComputedStyle
                ? getComputedStyle(parent, null)
                : parent.currentStyle)[size]
            )
          : 0
      }

      const getPosition = (isNavBottom, gap, position) => {
        if (!isDesktop && isNavBottom && position === 'bottom') {
          return '0px'
        } else if (!isDesktop && isNavBottom && position === 'top') {
          return 'auto'
        } else if (position === 'bottom') {
          return ''
        } else {
          return gap + 'px'
        }
      }

      // Get header height
      const elNavigation = isDesktop
        ? document.querySelector('.it-header-navbar-wrapper')
        : document.querySelector('.it-header-center-wrapper')

      runCheckOnScroll = () => {
        // Set monitoring offset top
        const navOffsetTop = elNavigation ? elNavigation.offsetHeight : 0
        // Check the sticky status
        const runCheckSticky = elSticky => {
          // Check is set on bottom
          const navBottom = elSticky.outerHTML.includes('it-bottom-navscroll')

          const elHeight = elSticky.offsetHeight
          // Get parent params
          const parent = elSticky.parentNode
          parent.style.position = 'relative'
          const parentWidth = parent.offsetWidth || 0
          const parentHeight = parent.offsetHeight
          const parentPaddingTop = getPadding(parent, 'paddingTop')
          const parentPaddingWidth = getPadding(parent, 'paddingRight')
          // Get distance of a element from top
          const distanceToTop = parent.getBoundingClientRect().top || 0
          const gap = navOffsetTop + parentPaddingTop

          // Check if it's sticky
          if (!isSticky && distanceToTop <= navOffsetTop) {
            isSticky = true
            elSticky.classList.add('is-sticky')
            elSticky.style.top = getPosition(navBottom, gap, 'top')
            elSticky.style.bottom = getPosition(navBottom, gap, 'bottom')
            elSticky.style.width = parentWidth - parentPaddingWidth + 'px'
          } else if (isSticky && distanceToTop > navOffsetTop) {
            isSticky = false
            elSticky.classList.remove('is-sticky')
            elSticky.style.top = ''
            elSticky.style.bottom = ''
            elSticky.style.width = ''
          }

          // Check if at bottom of parent
          if (isSticky && isDesktop) {
            if (
              distanceToTop < 0 &&
              Math.abs(distanceToTop) +
                elHeight +
                parentPaddingTop +
                navOffsetTop >
                parentHeight
            ) {
              elSticky.classList.add('at-bottom')
            } else {
              elSticky.classList.remove('at-bottom')
            }
          }
        }

        Array.from(elWrappers).forEach(elSticky => {
          runCheckSticky(elSticky)
        })
      }

      window.addEventListener('scroll', runCheckOnScroll)
    }

    const onResize = () => {
      if (runCheckOnScroll) {
        window.removeEventListener('scroll', runCheckOnScroll)
        const stillDesktop = isHidden(elToggler)
        initSticky(stillDesktop)
      }
    }

    window.addEventListener('resize', onResize)

    initSticky(isDesktop)
  }
})()
