import type {
  CSSUIObject,
  HTMLUIProps,
  ThemeProps,
  CSSUIProps,
} from "@yamada-ui/core"
import {
  ui,
  forwardRef,
  useComponentMultiStyle,
  omitThemeProps,
} from "@yamada-ui/core"
import { FileInput } from "@yamada-ui/file-input"
import { useToken } from "@yamada-ui/use-token"
import { cx, filterUndefined, getValidChildren } from "@yamada-ui/utils"
import { cloneElement } from "react"
import { Input } from "./input"
import { InputLeftAddon, InputRightAddon } from "./input-addon"
import { InputGroupProvider } from "./input-context"
import { InputRightElement, InputLeftElement } from "./input-element"

export interface InputGroupProps extends HTMLUIProps, ThemeProps<"Input"> {}

export const InputGroup = forwardRef<InputGroupProps, "div">((props, ref) => {
  const [styles] = useComponentMultiStyle("Input", props)
  const { className, children, ...rest } = omitThemeProps(props)

  const css: CSSUIObject = {
    width: "100%",
    display: "flex",
    position: "relative",
    ...styles.container,
  }
  const groupProps: CSSUIProps = {}
  const minHeight: any =
    useToken("sizes", (styles.field?.minHeight ?? styles.field?.minH) as any) ??
    styles.field?.minHeight ??
    styles.field?.minH
  const height: any =
    useToken("sizes", (styles.field?.height ?? styles.field?.h) as any) ??
    styles.field?.height ??
    styles.field?.h

  const validChildren = getValidChildren(children)

  validChildren.forEach((child: any) => {
    if ((minHeight || height) && child.type === InputLeftElement)
      groupProps.paddingStart = height ?? minHeight

    if ((minHeight || height) && child.type === InputRightElement)
      groupProps.paddingEnd = height ?? minHeight

    if (child.type === InputLeftAddon) groupProps.roundedLeft = 0

    if (child.type === InputRightAddon) groupProps.roundedRight = 0
  })

  const cloneChildren = validChildren.map((child) => {
    const childProps = filterUndefined({
      size: child.props?.size || props.size,
      variant: child.props?.variant || props.variant,
      ...child.props,
    })

    return child.type !== Input && child.type !== FileInput
      ? cloneElement(child, childProps)
      : cloneElement(child, Object.assign(childProps, groupProps))
  })

  return (
    <InputGroupProvider value={styles}>
      <ui.div
        ref={ref}
        className={cx("ui-input-group", className)}
        role="group"
        __css={css}
        {...rest}
      >
        {cloneChildren}
      </ui.div>
    </InputGroupProvider>
  )
})
