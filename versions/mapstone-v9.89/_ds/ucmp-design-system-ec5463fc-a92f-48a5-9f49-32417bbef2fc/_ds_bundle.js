/* @ds-bundle: {"format":4,"namespace":"UCMPDesignSystem_ec5463","components":[{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"CSPIcon","sourcePath":"components/core/CSPChip.jsx"},{"name":"CSPChip","sourcePath":"components/core/CSPChip.jsx"},{"name":"Checkbox","sourcePath":"components/core/Checkbox.jsx"},{"name":"Chip","sourcePath":"components/core/Chip.jsx"},{"name":"CircleLoader","sourcePath":"components/core/CircleLoader.jsx"},{"name":"Skeleton","sourcePath":"components/core/CircleLoader.jsx"},{"name":"ExternalLinkButton","sourcePath":"components/core/ExternalLinkButton.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"Logo","sourcePath":"components/core/Logo.jsx"},{"name":"Select","sourcePath":"components/core/Select.jsx"},{"name":"StatusBadge","sourcePath":"components/core/StatusBadge.jsx"},{"name":"CountBadge","sourcePath":"components/core/StatusBadge.jsx"},{"name":"Tag","sourcePath":"components/core/StatusBadge.jsx"},{"name":"TabCount","sourcePath":"components/core/StatusBadge.jsx"},{"name":"Toast","sourcePath":"components/core/Toast.jsx"},{"name":"ToggleSwitch","sourcePath":"components/core/ToggleSwitch.jsx"},{"name":"Tooltip","sourcePath":"components/core/Tooltip.jsx"},{"name":"DetailListItem","sourcePath":"components/data/DetailListItem.jsx"},{"name":"ErrorNotice","sourcePath":"components/data/ErrorNotice.jsx"},{"name":"GaugeChart","sourcePath":"components/data/GaugeChart.jsx"},{"name":"GuidePanel","sourcePath":"components/data/GuidePanel.jsx"},{"name":"StatCard","sourcePath":"components/data/StatCard.jsx"},{"name":"Table","sourcePath":"components/data/Table.jsx"},{"name":"TopFiveList","sourcePath":"components/data/TopFiveList.jsx"},{"name":"UserInfoCard","sourcePath":"components/data/UserInfoCard.jsx"},{"name":"CurrencyToggle","sourcePath":"components/forms/CurrencyToggle.jsx"},{"name":"DateRangePicker","sourcePath":"components/forms/DateRangePicker.jsx"},{"name":"FormField","sourcePath":"components/forms/FormField.jsx"},{"name":"FormGroup","sourcePath":"components/forms/FormField.jsx"},{"name":"KeywordSearch","sourcePath":"components/forms/KeywordSearch.jsx"},{"name":"MultiSelector","sourcePath":"components/forms/MultiSelector.jsx"},{"name":"Breadcrumbs","sourcePath":"components/layout/Breadcrumbs.jsx"},{"name":"ContentLayout","sourcePath":"components/layout/ContentLayout.jsx"},{"name":"Dialog","sourcePath":"components/layout/Dialog.jsx"},{"name":"Pagination","sourcePath":"components/layout/Pagination.jsx"},{"name":"SectionLayout","sourcePath":"components/layout/SectionLayout.jsx"},{"name":"SidePanel","sourcePath":"components/layout/SidePanel.jsx"},{"name":"SidebarNav","sourcePath":"components/layout/SidebarNav.jsx"},{"name":"SubTabs","sourcePath":"components/layout/SubTabs.jsx"}],"sourceHashes":{"components/core/Avatar.jsx":"75ebd2de146a","components/core/Button.jsx":"621af04dfec2","components/core/CSPChip.jsx":"4edabef3be61","components/core/Checkbox.jsx":"8f7d81ed70a7","components/core/Chip.jsx":"2acc57746078","components/core/CircleLoader.jsx":"57722d839a4d","components/core/ExternalLinkButton.jsx":"44a6bff852af","components/core/Input.jsx":"42ef12977c0f","components/core/Logo.jsx":"30893a143f23","components/core/Select.jsx":"077ed72c8066","components/core/StatusBadge.jsx":"4b56c0f11e76","components/core/Toast.jsx":"fc0a9df08e56","components/core/ToggleSwitch.jsx":"d5d23c19a4d0","components/core/Tooltip.jsx":"20e8e364764d","components/data/DetailListItem.jsx":"af8925d67d91","components/data/ErrorNotice.jsx":"9dea45fe04de","components/data/GaugeChart.jsx":"309e8640e653","components/data/GuidePanel.jsx":"2ad83dcb661d","components/data/StatCard.jsx":"7b6536f5ec4f","components/data/Table.jsx":"2864281596e9","components/data/TopFiveList.jsx":"e6b9041ac8de","components/data/UserInfoCard.jsx":"ecd734deacf5","components/forms/CurrencyToggle.jsx":"67624005ecca","components/forms/DateRangePicker.jsx":"8e26c34d34c1","components/forms/FormField.jsx":"82e71b12b7f8","components/forms/KeywordSearch.jsx":"b3eea57ad594","components/forms/MultiSelector.jsx":"696136c9c9a9","components/layout/Breadcrumbs.jsx":"572c5714be09","components/layout/ContentLayout.jsx":"ad6b4956af4c","components/layout/Dialog.jsx":"0c79692cc55e","components/layout/Pagination.jsx":"839400f7e9fd","components/layout/SectionLayout.jsx":"a13b78db86f2","components/layout/SidePanel.jsx":"9990f6935355","components/layout/SidebarNav.jsx":"acfc90e79c6b","components/layout/SubTabs.jsx":"9a4daf01b12a","ui_kits/cms-admin/CmsScreens.jsx":"a8334da6c391","ui_kits/cms-admin/CmsShell.jsx":"18bd560715d8","ui_kits/service-console/AccountsScreen.jsx":"c50f8d583733","ui_kits/service-console/AppShell.jsx":"cccf5c4c4242","ui_kits/service-console/FinOpsScreen.jsx":"3bca234c0036","ui_kits/service-console/HomeScreen.jsx":"94804b3daad5","ui_kits/service-console/RequestFormScreen.jsx":"b26f4eecc3bb","ui_kits/service-console/SecurityScreen.jsx":"8e6cbcae7b3f"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.UCMPDesignSystem_ec5463 = window.UCMPDesignSystem_ec5463 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Avatar.jsx
try { (() => {
const PALETTE = ['#e30084', '#1d3e80', '#526a69', '#00aa02', '#f86800', '#66707a', '#b20068', '#86b1e3'];
function hashColor(name = '') {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 997;
  return PALETTE[h % PALETTE.length];
}

/** Circular initial avatar; background colour is derived from the name. */
function Avatar({
  name = '',
  size = 32,
  isOwner = false,
  style
}) {
  const initial = name.trim().slice(0, 1).toUpperCase() || '?';
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size,
      borderRadius: '50%',
      background: hashColor(name),
      color: '#fff',
      fontSize: Math.round(size * 0.44),
      fontWeight: 'var(--font-weight-semibold)',
      ...style
    }
  }, initial), isOwner && /*#__PURE__*/React.createElement("span", {
    "aria-label": "\uC18C\uC720\uC790",
    style: {
      position: 'absolute',
      top: -5,
      left: '50%',
      transform: 'translateX(-50%)',
      color: 'var(--color-status-info)',
      lineHeight: 1
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 7l4.5 3.5L12 4l4.5 6.5L21 7v11H3V7z"
  }))));
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const V = {
  'primary-solid': {
    base: {
      background: 'var(--color-primary)',
      color: 'var(--color-text-neutral-0)',
      border: '0'
    },
    hover: {
      background: 'var(--color-primary-hover)'
    },
    active: {
      background: 'var(--color-primary-pressed)'
    },
    disabled: {
      background: 'var(--color-primary-disabled)',
      color: 'var(--color-text-neutral-0-dimmed)'
    }
  },
  'primary-outline': {
    base: {
      background: 'var(--color-bg-neutral-0)',
      color: 'var(--color-primary)',
      border: '1px solid var(--color-primary)'
    },
    hover: {
      background: 'var(--color-bg-neutral-0-hover)',
      borderColor: 'var(--color-primary-hover)',
      color: 'var(--color-primary-hover)'
    },
    active: {
      background: 'var(--color-bg-neutral-0-pressed)'
    },
    disabled: {
      borderColor: 'var(--color-primary-disabled)',
      color: 'var(--color-primary-dimmed)'
    }
  },
  'primary-ghost': {
    base: {
      background: 'var(--color-bg-neutral-0)',
      color: 'var(--color-primary)',
      border: '0'
    },
    hover: {
      background: 'var(--color-bg-neutral-0-hover)',
      color: 'var(--color-primary-hover)'
    },
    active: {
      background: 'var(--color-bg-neutral-0-pressed)'
    },
    disabled: {
      color: 'var(--color-primary-dimmed)'
    }
  },
  'primary-plain': {
    base: {
      background: 'transparent',
      color: 'var(--color-primary)',
      border: '0',
      padding: 0,
      height: 'auto'
    },
    hover: {
      color: 'var(--color-primary-hover)'
    },
    active: {
      color: 'var(--color-primary-pressed)'
    },
    disabled: {
      color: 'var(--color-primary-dimmed)'
    }
  },
  'secondary-solid': {
    base: {
      background: 'var(--color-secondary)',
      color: 'var(--color-text-neutral-0)',
      border: '0'
    },
    hover: {
      background: 'var(--color-secondary-hover)'
    },
    active: {
      background: 'var(--color-secondary-pressed)'
    },
    disabled: {
      background: 'var(--color-secondary-disabled)',
      color: 'var(--color-text-neutral-0-dimmed)'
    }
  },
  'secondary-outline': {
    base: {
      background: 'var(--color-bg-neutral-0)',
      color: 'var(--color-secondary)',
      border: '1px solid var(--color-secondary)'
    },
    hover: {
      background: 'var(--color-bg-neutral-0-hover)'
    },
    active: {
      background: 'var(--color-bg-neutral-0-pressed)'
    },
    disabled: {
      borderColor: 'var(--color-secondary-disabled)',
      color: 'var(--color-secondary-dimmed)'
    }
  },
  'secondary-ghost': {
    base: {
      background: 'var(--color-bg-neutral-0)',
      color: 'var(--color-secondary)',
      border: '0'
    },
    hover: {
      background: 'var(--color-bg-neutral-0-hover)'
    },
    active: {
      background: 'var(--color-bg-neutral-0-pressed)'
    },
    disabled: {
      color: 'var(--color-secondary-dimmed)'
    }
  },
  'secondary-plain': {
    base: {
      background: 'transparent',
      color: 'var(--color-secondary)',
      border: '0',
      padding: 0,
      height: 'auto'
    },
    hover: {
      color: 'var(--color-secondary-hover)'
    },
    active: {
      color: 'var(--color-secondary-pressed)'
    },
    disabled: {
      color: 'var(--color-secondary-dimmed)'
    }
  },
  'neutral-solid': {
    base: {
      background: 'var(--color-bg-neutral-2)',
      color: 'var(--color-text-neutral-3)',
      border: '0'
    },
    hover: {
      background: 'var(--color-bg-neutral-2-hover)'
    },
    active: {
      background: 'var(--color-bg-neutral-2-pressed)'
    },
    disabled: {
      color: 'var(--color-text-neutral-1)'
    }
  },
  'neutral-outline': {
    base: {
      background: 'var(--color-bg-neutral-0)',
      color: 'var(--color-text-neutral-3)',
      border: '1px solid var(--color-border-neutral-1)'
    },
    hover: {
      background: 'var(--color-bg-neutral-0-hover)'
    },
    active: {
      background: 'var(--color-bg-neutral-0-pressed)'
    },
    disabled: {
      color: 'var(--color-text-neutral-1)'
    }
  },
  'neutral-ghost': {
    base: {
      background: 'var(--color-bg-neutral-0)',
      color: 'var(--color-text-neutral-3)',
      border: '0'
    },
    hover: {
      background: 'var(--color-bg-neutral-0-hover)'
    },
    active: {
      background: 'var(--color-bg-neutral-0-pressed)'
    },
    disabled: {
      color: 'var(--color-text-neutral-1)'
    }
  },
  'neutral-plain': {
    base: {
      background: 'transparent',
      color: 'var(--color-text-neutral-3)',
      border: '0',
      padding: 0,
      height: 'auto'
    },
    hover: {
      color: 'var(--color-text-neutral-4)'
    },
    active: {
      color: 'var(--color-text-neutral-5)'
    },
    disabled: {
      color: 'var(--color-text-neutral-1)'
    }
  }
};
const SIZES = {
  sm: {
    height: 32,
    padding: '0 12px',
    fontSize: 'var(--text-xs)'
  },
  md: {
    height: 40,
    padding: '0 16px',
    fontSize: 'var(--text-sm)'
  },
  lg: {
    height: 52,
    padding: '0 20px',
    fontSize: 'var(--text-sm)'
  },
  'icon-sm': {
    height: 32,
    width: 32,
    padding: 0
  },
  'icon-md': {
    height: 40,
    width: 40,
    padding: 0
  },
  'icon-lg': {
    height: 52,
    width: 52,
    padding: 0
  }
};

/** UCMP Button — 12 variants ({primary|secondary|neutral}-{solid|outline|ghost|plain}) × 6 sizes. */
function Button({
  variant = 'primary-solid',
  size = 'md',
  loading = false,
  disabled = false,
  as = 'button',
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const v = V[variant] || V['primary-solid'];
  const s = SIZES[size] || SIZES.md;
  const isDisabled = disabled || loading;
  const outline = variant.endsWith('-outline');
  const plain = variant.endsWith('-plain');
  const pad = outline && !plain && s.padding !== 0 ? `0 ${parseInt(s.padding.split(' ')[1]) - 1}px` : s.padding;
  const Comp = as;
  const merged = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    userSelect: 'none',
    fontFamily: 'var(--font-pretendard)',
    fontWeight: 'var(--font-weight-semibold)',
    lineHeight: 1,
    borderRadius: 'var(--radius-button)',
    transition: 'color var(--duration-instant) var(--ease-standard),background-color var(--duration-instant) var(--ease-standard),border-color var(--duration-instant) var(--ease-standard)',
    cursor: isDisabled ? 'default' : 'pointer',
    pointerEvents: isDisabled ? 'none' : undefined,
    height: plain ? 'auto' : s.height,
    width: s.width,
    padding: plain ? 0 : pad,
    fontSize: s.fontSize || 'var(--text-sm)',
    ...v.base,
    ...(hover && !isDisabled ? v.hover : null),
    ...(active && !isDisabled ? v.active : null),
    ...(isDisabled ? v.disabled : null),
    ...style
  };
  return /*#__PURE__*/React.createElement(Comp, _extends({
    type: as === 'button' ? 'button' : undefined,
    disabled: as === 'button' ? isDisabled : undefined,
    "aria-busy": loading || undefined,
    style: merged,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setActive(false);
    },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false)
  }, rest), loading && /*#__PURE__*/React.createElement(CircleSpinner, null), children);
}
function CircleSpinner() {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      width: 14,
      height: 14,
      borderRadius: '50%',
      border: '2px solid currentColor',
      borderTopColor: 'transparent',
      animation: 'ucmp-spin 1s var(--ease-linear) infinite'
    }
  });
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/CSPChip.jsx
try { (() => {
const CSP = {
  AWS: {
    color: 'var(--color-csp-aws)',
    src: 'assets/csp/AWS.webp',
    size: 24
  },
  AZURE: {
    color: 'var(--color-csp-azure)',
    src: 'assets/csp/AZURE.png',
    size: 20
  },
  GCP: {
    color: 'var(--color-csp-gcp)',
    src: 'assets/csp/GCP.png',
    size: 24
  }
};

/** Cloud provider logo, sized per provider as in the product (Azure 20px, others 24px). */
function CSPIcon({
  csp = 'AWS',
  size,
  assetBase = '',
  style
}) {
  const c = CSP[csp] || CSP.AWS;
  const px = size || c.size;
  return /*#__PURE__*/React.createElement("img", {
    src: assetBase + c.src,
    width: px,
    height: px,
    alt: `${csp}-icon`,
    style: {
      objectFit: 'contain',
      ...style
    }
  });
}

/** Round provider-coloured chip. Provider colours are each vendor's own CI colour. */
function CSPChip({
  csp = 'AWS',
  children,
  style
}) {
  const c = CSP[csp] || CSP.AWS;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      height: 24,
      padding: '0 10px',
      borderRadius: 'var(--radius-full)',
      background: c.color,
      color: '#fff',
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--font-weight-semibold)',
      ...style
    }
  }, children || csp);
}
Object.assign(__ds_scope, { CSPIcon, CSPChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/CSPChip.jsx", error: String((e && e.message) || e) }); }

// components/core/Checkbox.jsx
try { (() => {
/** UCMP checkbox — 16px, 4px radius, filled with theme colour when checked. */
function Checkbox({
  checked = false,
  indeterminate = false,
  theme = 'secondary',
  disabled = false,
  onChange,
  label,
  id,
  style
}) {
  const on = checked || indeterminate;
  const accent = theme === 'primary' ? 'var(--color-primary)' : 'var(--color-secondary)';
  const box = /*#__PURE__*/React.createElement("span", {
    role: "checkbox",
    "aria-checked": indeterminate ? 'mixed' : checked,
    tabIndex: disabled ? -1 : 0,
    onClick: () => !disabled && onChange && onChange(!checked),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 16,
      height: 16,
      flexShrink: 0,
      borderRadius: 'var(--radius-xs)',
      border: '1px solid ' + (on ? accent : 'var(--color-border-neutral-2)'),
      background: on ? accent : 'var(--color-bg-neutral-0)',
      color: '#fff',
      boxShadow: 'var(--shadow-sm)',
      opacity: disabled ? 0.2 : 1,
      cursor: disabled ? 'not-allowed' : 'pointer',
      ...style
    }
  }, indeterminate ? /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "5.25",
    width: "8",
    height: "1.5",
    fill: "currentColor"
  })) : checked ? /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2 6.2l2.6 2.6L10 3.4",
    stroke: "currentColor",
    strokeWidth: "1.8",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })) : null);
  if (!label) return box;
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: id,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 'var(--text-sm)',
      color: 'var(--color-text-neutral-6)',
      cursor: disabled ? 'not-allowed' : 'pointer'
    }
  }, box, /*#__PURE__*/React.createElement("span", null, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/core/Chip.jsx
try { (() => {
/** Pill chip — 24px tall, neutral-300 fill, 14px semibold. Icon slot optional. */
function Chip({
  children,
  icon,
  onRemove,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      height: 24,
      padding: '0 8px',
      borderRadius: 'var(--radius-full)',
      background: 'var(--color-bg-neutral-3)',
      color: 'var(--color-text-neutral-5)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--font-weight-semibold)',
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      width: 16,
      height: 16
    }
  }, icon), /*#__PURE__*/React.createElement("span", null, children), onRemove && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onRemove,
    "aria-label": "\uC0AD\uC81C",
    style: {
      display: 'inline-flex',
      border: 0,
      background: 'none',
      padding: 0,
      cursor: 'pointer',
      color: 'inherit'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 3l6 6M9 3l-6 6",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round"
  }))));
}
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Chip.jsx", error: String((e && e.message) || e) }); }

// components/core/CircleLoader.jsx
try { (() => {
/** Spinner used inside buttons and small loading slots. */
function CircleLoader({
  diameter = '16px',
  borderWidth = '2px',
  borderColor = 'var(--color-primary)',
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    role: "status",
    style: {
      display: 'inline-block',
      width: diameter,
      height: diameter,
      borderRadius: '50%',
      border: `${borderWidth} solid ${borderColor}`,
      borderTopColor: 'transparent',
      animation: 'ucmp-spin 1s var(--ease-linear) infinite',
      ...style
    }
  });
}

/** Pulsing grey block. UCMP prefers skeletons over spinners for page-level loading. */
function Skeleton({
  width = '100%',
  height = 16,
  radius = 'var(--radius-xs)',
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      width,
      height,
      borderRadius: radius,
      background: 'var(--color-skeleton)',
      animation: 'ucmp-pulse 2s var(--ease-pulse) infinite',
      ...style
    }
  });
}
Object.assign(__ds_scope, { CircleLoader, Skeleton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/CircleLoader.jsx", error: String((e && e.message) || e) }); }

// components/core/ExternalLinkButton.jsx
try { (() => {
/** Text link that opens a new tab, with a trailing external-link glyph. */
function ExternalLinkButton({
  href = '#',
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("a", {
    href: href,
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      color: 'var(--color-text-neutral-4)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--font-weight-semibold)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", null, children), /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M15 3h6v6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10 14L21 3"
  })));
}
Object.assign(__ds_scope, { ExternalLinkButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/ExternalLinkButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * UCMP text input — 32px tall, 6px radius, 14px text, black focus border.
 * Values verbatim from packages/ui/atoms/input.
 */
function Input({
  status = 'default',
  style,
  disabled,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("input", _extends({
    disabled: disabled,
    onFocus: e => {
      setFocus(true);
      rest.onFocus && rest.onFocus(e);
    },
    onBlur: e => {
      setFocus(false);
      rest.onBlur && rest.onBlur(e);
    },
    style: {
      height: 32,
      width: '100%',
      padding: '0 8px',
      borderRadius: 'var(--radius-control)',
      border: '1px solid ' + (status === 'error' ? 'var(--color-status-error)' : focus ? 'var(--color-black)' : 'var(--color-border-neutral-2)'),
      background: 'var(--color-bg-neutral-0)',
      color: 'var(--color-text-neutral-6)',
      fontFamily: 'var(--font-pretendard)',
      fontSize: 'var(--text-sm)',
      outline: 'none',
      opacity: disabled ? 0.5 : 1,
      cursor: disabled ? 'not-allowed' : undefined,
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/Logo.jsx
try { (() => {
const SIZE = {
  small: [28, 'var(--text-lg)'],
  medium: [32, 'var(--text-xl)'],
  large: [40, 'var(--text-2xl)']
};

/**
 * UCMP wordmark lockup: rounded glass tile mark + "UCMP" in bold Pretendard.
 * The mark asset is assets/brand/ucmp-mark.svg (copied from the codebase).
 */
function Logo({
  size = 'small',
  text = 'UCMP',
  assetBase = '',
  showText = true,
  style
}) {
  const [px, fs] = SIZE[size] || SIZE.small;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      userSelect: 'none',
      ...style
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: assetBase + 'assets/brand/ucmp-mark.svg',
    width: px,
    height: px,
    alt: "",
    style: {
      flexShrink: 0
    }
  }), showText && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: fs,
      fontWeight: 'var(--font-weight-bold)',
      letterSpacing: 'var(--tracking-tight)',
      color: 'var(--color-text-neutral-6)'
    }
  }, text));
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Logo.jsx", error: String((e && e.message) || e) }); }

// components/core/Select.jsx
try { (() => {
/**
 * Select trigger + menu. Trigger matches Input geometry (32px, 6px radius);
 * the menu is a white popover with 1px border, md shadow, 4px item radius.
 */
function Select({
  value,
  options = [],
  placeholder = '선택',
  onChange,
  disabled = false,
  width = 220,
  style
}) {
  const [open, setOpen] = React.useState(false);
  const selected = options.find(o => (o.value ?? o) === value);
  const label = selected ? selected.label ?? selected : placeholder;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width,
      ...style
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    disabled: disabled,
    onClick: () => setOpen(o => !o),
    "aria-expanded": open,
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      width: '100%',
      height: 32,
      padding: '0 8px',
      borderRadius: 'var(--radius-control)',
      border: '1px solid var(--color-border-neutral-2)',
      background: 'var(--color-bg-neutral-0)',
      fontFamily: 'var(--font-pretendard)',
      fontSize: 'var(--text-sm)',
      color: selected ? 'var(--color-text-neutral-6)' : 'var(--color-text-neutral-1)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, label), /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--color-icon-neutral-3)",
    strokeWidth: "2",
    strokeLinecap: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 9l6 6 6-6"
  }))), open && /*#__PURE__*/React.createElement("div", {
    role: "listbox",
    style: {
      position: 'absolute',
      top: 'calc(100% + 4px)',
      left: 0,
      right: 0,
      zIndex: 30,
      padding: 4,
      borderRadius: 'var(--radius-control)',
      border: '1px solid var(--color-border-neutral-2)',
      background: 'var(--color-bg-neutral-0)',
      boxShadow: 'var(--shadow-md)',
      maxHeight: 240,
      overflowY: 'auto'
    }
  }, options.map(o => {
    const v = o.value ?? o;
    const l = o.label ?? o;
    const on = v === value;
    return /*#__PURE__*/React.createElement("div", {
      key: v,
      role: "option",
      "aria-selected": on,
      onClick: () => {
        onChange && onChange(v);
        setOpen(false);
      },
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        padding: '8px 12px',
        borderRadius: 'var(--radius-xs)',
        cursor: 'pointer',
        fontSize: 'var(--text-sm)',
        fontWeight: on ? 'var(--font-weight-semibold)' : 400,
        color: 'var(--color-text-neutral-6)'
      },
      onMouseEnter: e => e.currentTarget.style.background = 'var(--color-bg-neutral-2)',
      onMouseLeave: e => e.currentTarget.style.background = 'transparent'
    }, /*#__PURE__*/React.createElement("span", null, l), on && /*#__PURE__*/React.createElement("svg", {
      width: "12",
      height: "12",
      viewBox: "0 0 12 12",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M2 6.2l2.6 2.6L10 3.4",
      stroke: "currentColor",
      strokeWidth: "1.8",
      fill: "none",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    })));
  })));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Select.jsx", error: String((e && e.message) || e) }); }

// components/core/StatusBadge.jsx
try { (() => {
const TONES = {
  success: {
    bg: 'var(--palette-green-100)',
    fg: 'var(--palette-green-800)'
  },
  error: {
    bg: 'var(--palette-red-100)',
    fg: 'var(--palette-red-800)'
  },
  progress: {
    bg: 'var(--palette-gray-100)',
    fg: 'var(--palette-gray-500)'
  },
  warning: {
    bg: 'var(--palette-orange-100)',
    fg: 'var(--palette-orange-500)'
  },
  info: {
    bg: 'var(--palette-blue-100)',
    fg: 'var(--palette-blue-600)'
  }
};

/** Pill status badge for table cells and task rows. */
function StatusBadge({
  tone = 'progress',
  children,
  style
}) {
  const t = TONES[tone] || TONES.progress;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 8px',
      borderRadius: 'var(--radius-full)',
      background: t.bg,
      color: t.fg,
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--font-weight-semibold)',
      lineHeight: 1,
      ...style
    }
  }, children);
}

/** Magenta count badge — the one place brand colour appears as a fill in dense UI. */
function CountBadge({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: 20,
      padding: '0 12px',
      borderRadius: 'var(--radius-full)',
      background: 'var(--color-primary)',
      color: '#fff',
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--font-weight-semibold)',
      ...style
    }
  }, children);
}

/** Outlined tag — black hairline, 6px radius, tight padding. */
function Tag({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '0 4px',
      border: '1px solid var(--color-black)',
      borderRadius: 'var(--radius-control)',
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--font-weight-semibold)',
      color: 'var(--color-text-neutral-6)',
      ...style
    }
  }, children);
}

/** Neutral count pill used beside sub-tab labels. */
function TabCount({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 25,
      padding: '4px 8px',
      borderRadius: 'var(--radius-xs)',
      background: 'var(--color-bg-neutral-2)',
      color: 'var(--color-text-neutral-3)',
      fontSize: 'var(--text-xs)',
      textAlign: 'center',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { StatusBadge, CountBadge, Tag, TabCount });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/StatusBadge.jsx", error: String((e && e.message) || e) }); }

// components/core/Toast.jsx
try { (() => {
/**
 * Bottom-centre pill toast on a blurred near-black scrim.
 * Product duration is 5000ms; message copy is Korean and ends in 다/요.
 */
function Toast({
  children,
  tone = 'default',
  style
}) {
  const dot = {
    success: 'var(--color-status-success)',
    error: 'var(--color-status-error)'
  }[tone];
  return /*#__PURE__*/React.createElement("div", {
    role: "status",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '10px 20px',
      borderRadius: 'var(--radius-full)',
      background: 'var(--toast-bg)',
      backdropFilter: 'var(--toast-blur)',
      WebkitBackdropFilter: 'var(--toast-blur)',
      color: '#fff',
      fontSize: 13,
      fontWeight: 700,
      ...style
    }
  }, dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: dot
    }
  }), children);
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Toast.jsx", error: String((e && e.message) || e) }); }

// components/core/ToggleSwitch.jsx
try { (() => {
const S = {
  sm: {
    track: [36, 20],
    thumb: 16,
    on: 16
  },
  md: {
    track: [44, 24],
    thumb: 20,
    on: 20
  }
};

/** Toggle switch — magenta track when on, neutral-300 when off. */
function ToggleSwitch({
  checked = false,
  onChange,
  disabled = false,
  size = 'sm',
  style
}) {
  const s = S[size] || S.sm;
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    role: "switch",
    "aria-checked": checked,
    disabled: disabled,
    onClick: e => {
      e.stopPropagation();
      if (!disabled && onChange) onChange(!checked);
    },
    style: {
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      flexShrink: 0,
      width: s.track[0],
      height: s.track[1],
      padding: 0,
      border: 0,
      borderRadius: 'var(--radius-full)',
      background: checked ? 'var(--color-primary)' : 'var(--color-neutral-300)',
      transition: 'background-color var(--duration-normal) var(--ease-standard)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      width: s.thumb,
      height: s.thumb,
      borderRadius: '50%',
      background: '#fff',
      boxShadow: 'var(--shadow-sm)',
      transform: `translateX(${checked ? s.on : 2}px)`,
      transition: 'transform var(--duration-normal) var(--ease-standard)'
    }
  }));
}
Object.assign(__ds_scope, { ToggleSwitch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/ToggleSwitch.jsx", error: String((e && e.message) || e) }); }

// components/core/Tooltip.jsx
try { (() => {
/** Hover tooltip: white surface, hairline border, md shadow, 12px copy. */
function Tooltip({
  children,
  content,
  side = 'top',
  style
}) {
  const [open, setOpen] = React.useState(false);
  const pos = {
    top: {
      bottom: 'calc(100% + 6px)',
      left: '50%',
      transform: 'translateX(-50%)'
    },
    bottom: {
      top: 'calc(100% + 6px)',
      left: '50%',
      transform: 'translateX(-50%)'
    },
    right: {
      left: 'calc(100% + 6px)',
      top: '50%',
      transform: 'translateY(-50%)'
    },
    left: {
      right: 'calc(100% + 6px)',
      top: '50%',
      transform: 'translateY(-50%)'
    }
  }[side];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex'
    },
    onMouseEnter: () => setOpen(true),
    onMouseLeave: () => setOpen(false)
  }, children, open && /*#__PURE__*/React.createElement("span", {
    role: "tooltip",
    style: {
      position: 'absolute',
      zIndex: 40,
      whiteSpace: 'nowrap',
      padding: '6px 8px',
      borderRadius: 'var(--radius-control)',
      border: '1px solid var(--color-border-neutral-2)',
      background: 'var(--color-bg-neutral-0)',
      boxShadow: 'var(--shadow-md)',
      color: 'var(--color-text-neutral-6)',
      fontSize: 'var(--text-xs)',
      ...pos,
      ...style
    }
  }, content));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/data/DetailListItem.jsx
try { (() => {
/** Label/value row for detail panes. Label is fixed-width, semibold, neutral-3. */
function DetailListItem({
  label,
  children,
  labelWidth = 140,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      padding: '10px 0',
      borderBottom: '1px solid var(--color-border-neutral-1)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: labelWidth,
      flexShrink: 0,
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--font-weight-semibold)',
      color: 'var(--color-text-neutral-3)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      fontSize: 'var(--text-sm)',
      color: 'var(--color-text-neutral-6)'
    }
  }, children));
}
Object.assign(__ds_scope, { DetailListItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/DetailListItem.jsx", error: String((e && e.message) || e) }); }

// components/data/ErrorNotice.jsx
try { (() => {
/**
 * Full-block empty / error state. The product uses the no-data illustration at
 * assets/infra/no-data.webp; pass assetBase to point at it from a nested page.
 */
function ErrorNotice({
  title = '데이터가 없습니다.',
  description,
  action,
  illustration = true,
  assetBase = '',
  minHeight = 200,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      minHeight,
      padding: 24,
      borderRadius: 'var(--radius-control)',
      background: 'var(--color-bg-neutral-2)',
      textAlign: 'center',
      ...style
    }
  }, illustration && /*#__PURE__*/React.createElement("img", {
    src: assetBase + 'assets/infra/no-data.webp',
    alt: "",
    width: "72",
    height: "72",
    style: {
      opacity: 0.9,
      objectFit: 'contain'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--font-weight-semibold)',
      color: 'var(--color-text-neutral-3)'
    }
  }, title), description && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--color-text-neutral-2)'
    }
  }, description), action);
}
Object.assign(__ds_scope, { ErrorNotice });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/ErrorNotice.jsx", error: String((e && e.message) || e) }); }

// components/data/GaugeChart.jsx
try { (() => {
/**
 * Donut gauge for a single ratio. Track is neutral-200; the arc uses the passed
 * colour (magenta by default). Value is rendered bold in the centre.
 */
function GaugeChart({
  value = 0,
  size = 120,
  thickness = 12,
  color = 'var(--color-primary)',
  label,
  style
}) {
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: size,
      height: size,
      ...style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    style: {
      transform: 'rotate(-90deg)'
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    stroke: "var(--color-neutral-200)",
    strokeWidth: thickness
  }), /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    stroke: color,
    strokeWidth: thickness,
    strokeLinecap: "round",
    strokeDasharray: `${c * pct / 100} ${c}`
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-2xl)',
      lineHeight: 1,
      fontWeight: 'var(--font-weight-bold)',
      color: 'var(--color-text-neutral-6)'
    }
  }, pct, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)'
    }
  }, "%")), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--color-text-neutral-2)'
    }
  }, label)));
}
Object.assign(__ds_scope, { GaugeChart });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/GaugeChart.jsx", error: String((e && e.message) || e) }); }

// components/data/GuidePanel.jsx
try { (() => {
const TONES = {
  info: {
    bg: 'var(--palette-blue-50)',
    border: 'var(--palette-blue-100)',
    fg: 'var(--palette-blue-600)'
  },
  warning: {
    bg: 'var(--palette-orange-50)',
    border: 'var(--palette-orange-200)',
    fg: 'var(--palette-orange-500)'
  },
  error: {
    bg: 'var(--palette-red-100)',
    border: 'var(--palette-red-100)',
    fg: 'var(--palette-red-800)'
  }
};

/** Inline guidance banner. Info for guides, warning for cautions, error for failures. */
function GuidePanel({
  tone = 'info',
  title,
  children,
  style
}) {
  const t = TONES[tone] || TONES.info;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      padding: 16,
      borderRadius: 'var(--radius-control)',
      border: `1px solid ${t.border}`,
      background: t.bg,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flexShrink: 0,
      color: t.fg,
      lineHeight: 0,
      marginTop: 1
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 2a10 10 0 100 20 10 10 0 000-20zm0 5a1.2 1.2 0 110 2.4A1.2 1.2 0 0112 7zm1.2 10.5h-2.4v-6h2.4v6z"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      minWidth: 0
    }
  }, title && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--font-weight-semibold)',
      color: t.fg
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-xs)',
      lineHeight: 'var(--leading-relaxed)',
      color: 'var(--color-text-neutral-4)'
    }
  }, children)));
}
Object.assign(__ds_scope, { GuidePanel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/GuidePanel.jsx", error: String((e && e.message) || e) }); }

// components/data/StatCard.jsx
try { (() => {
/**
 * Single-metric tile for dashboard grids. Numbers are bold and large; the label
 * sits above in neutral-3 at 12px. Delta is green for down-cost, red for up.
 */
function StatCard({
  label,
  value,
  unit,
  delta,
  deltaTone = 'neutral',
  footnote,
  style
}) {
  const tone = {
    up: 'var(--color-status-error)',
    down: 'var(--color-status-success)',
    neutral: 'var(--color-text-neutral-2)'
  }[deltaTone];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      padding: 20,
      borderRadius: 'var(--radius-control)',
      border: '1px solid var(--color-border-neutral-2)',
      background: 'var(--color-bg-neutral-0)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--color-text-neutral-3)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-4xl)',
      lineHeight: 'var(--leading-4xl)',
      fontWeight: 'var(--font-weight-bold)',
      color: 'var(--color-text-neutral-6)'
    }
  }, value), unit && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--color-text-neutral-3)'
    }
  }, unit), delta && /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 4,
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--font-weight-semibold)',
      color: tone
    }
  }, delta)), footnote && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--color-text-neutral-2)'
    }
  }, footnote));
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StatCard.jsx", error: String((e && e.message) || e) }); }

// components/data/Table.jsx
try { (() => {
/** Bordered table shell: 6px radius, white surface, hairline row rules. */
function Table({
  columns = [],
  rows = [],
  onRowClick,
  emptyText = '데이터가 없습니다.',
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      borderRadius: 'var(--radius-control)',
      border: '1px solid var(--color-border-neutral-2)',
      background: 'var(--color-bg-neutral-0)',
      overflow: 'hidden',
      ...style
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse'
    }
  }, /*#__PURE__*/React.createElement("thead", {
    style: {
      borderBottom: '1px solid var(--color-border-neutral-2)'
    }
  }, /*#__PURE__*/React.createElement("tr", null, columns.map((c, i) => /*#__PURE__*/React.createElement("th", {
    key: c.key || i,
    style: {
      padding: '8px',
      paddingRight: i === 0 ? 0 : 8,
      paddingLeft: i === columns.length - 1 ? 0 : 8,
      textAlign: c.align || 'left',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--font-weight-medium)',
      color: 'var(--color-text-neutral-2)',
      width: c.width
    }
  }, c.header)))), /*#__PURE__*/React.createElement("tbody", null, rows.length === 0 ? /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: columns.length,
    style: {
      height: 200,
      textAlign: 'center',
      background: 'var(--color-bg-neutral-2)',
      color: 'var(--color-text-neutral-2)',
      fontSize: 'var(--text-sm)'
    }
  }, emptyText)) : rows.map((r, ri) => /*#__PURE__*/React.createElement("tr", {
    key: r.id || ri,
    onClick: () => onRowClick && onRowClick(r),
    style: {
      borderBottom: ri === rows.length - 1 ? 0 : '1px solid var(--color-border-neutral-2)',
      cursor: onRowClick ? 'pointer' : undefined
    },
    onMouseEnter: e => e.currentTarget.style.background = 'var(--color-bg-neutral-1)',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent'
  }, columns.map((c, i) => /*#__PURE__*/React.createElement("td", {
    key: c.key || i,
    style: {
      padding: '8px',
      paddingRight: i === 0 ? 0 : 8,
      paddingLeft: i === columns.length - 1 ? 0 : 8,
      textAlign: c.align || 'left',
      fontSize: 'var(--text-sm)',
      color: 'var(--color-text-neutral-6)'
    }
  }, c.render ? c.render(r) : r[c.key])))))));
}
Object.assign(__ds_scope, { Table });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Table.jsx", error: String((e && e.message) || e) }); }

// components/data/TopFiveList.jsx
try { (() => {
/**
 * Ranked list with proportional bars — the FinOps "top 5" pattern.
 * Bars use the pastel chart palette, never brand magenta.
 */
function TopFiveList({
  items = [],
  color = 'var(--chart-net-cost)',
  valueFormatter = v => v,
  style
}) {
  const max = Math.max(...items.map(i => i.value), 1);
  return /*#__PURE__*/React.createElement("ul", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      margin: 0,
      padding: 0,
      listStyle: 'none',
      ...style
    }
  }, items.map((item, i) => /*#__PURE__*/React.createElement("li", {
    key: item.label,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      minWidth: 0,
      fontSize: 'var(--text-sm)',
      color: 'var(--color-text-neutral-6)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 16,
      color: 'var(--color-text-neutral-2)',
      fontSize: 'var(--text-xs)'
    }
  }, i + 1), /*#__PURE__*/React.createElement("span", {
    style: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, item.label)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--font-weight-semibold)',
      color: 'var(--color-text-neutral-6)'
    }
  }, valueFormatter(item.value))), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      height: 6,
      borderRadius: 'var(--radius-full)',
      background: 'var(--color-bg-neutral-2)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      height: 6,
      width: `${item.value / max * 100}%`,
      borderRadius: 'var(--radius-full)',
      background: color
    }
  })))));
}
Object.assign(__ds_scope, { TopFiveList });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/TopFiveList.jsx", error: String((e && e.message) || e) }); }

// components/data/UserInfoCard.jsx
try { (() => {
/** Person row: avatar + name/team + id. Used in member lists and approval lines. */
function UserInfoCard({
  name,
  team,
  userId,
  isOwner = false,
  right,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: 12,
      borderRadius: 'var(--radius-control)',
      border: '1px solid var(--color-border-neutral-2)',
      background: 'var(--color-bg-neutral-0)',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Avatar, {
    name: name,
    isOwner: isOwner
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--font-weight-semibold)',
      color: 'var(--color-text-neutral-6)'
    }
  }, name, team && /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 400,
      color: 'var(--color-text-neutral-3)'
    }
  }, team)), userId && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--color-text-neutral-2)'
    }
  }, userId)), right);
}
Object.assign(__ds_scope, { UserInfoCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/UserInfoCard.jsx", error: String((e && e.message) || e) }); }

// components/forms/CurrencyToggle.jsx
try { (() => {
/**
 * Two-state segmented control (KRW / USD in FinOps). Track is neutral-1, the
 * selected segment is a white pill with a hairline border.
 */
function CurrencyToggle({
  value = 'KRW',
  options = ['KRW', 'USD'],
  onChange,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      gap: 2,
      padding: 2,
      borderRadius: 'var(--radius-control)',
      background: 'var(--color-bg-neutral-1)',
      ...style
    }
  }, options.map(o => {
    const on = o === value;
    return /*#__PURE__*/React.createElement("button", {
      key: o,
      type: "button",
      onClick: () => onChange && onChange(o),
      style: {
        height: 26,
        padding: '0 12px',
        borderRadius: 'var(--radius-xs)',
        border: on ? '1px solid var(--color-border-neutral-2)' : '1px solid transparent',
        background: on ? 'var(--color-bg-neutral-0)' : 'transparent',
        fontFamily: 'var(--font-pretendard)',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--font-weight-semibold)',
        color: on ? 'var(--color-text-neutral-6)' : 'var(--color-text-neutral-2)',
        cursor: 'pointer'
      }
    }, o);
  }));
}
Object.assign(__ds_scope, { CurrencyToggle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/CurrencyToggle.jsx", error: String((e && e.message) || e) }); }

// components/forms/DateRangePicker.jsx
try { (() => {
/**
 * Read-only period trigger used by FinOps and task lists. Shows the range with a
 * leading calendar glyph; opening a real picker is the consumer's job.
 */
function DateRangePicker({
  from,
  to,
  onClick,
  style
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      height: 32,
      padding: '0 10px',
      borderRadius: 'var(--radius-control)',
      border: '1px solid var(--color-border-neutral-2)',
      background: 'var(--color-bg-neutral-0)',
      fontFamily: 'var(--font-pretendard)',
      fontSize: 'var(--text-sm)',
      color: 'var(--color-text-neutral-6)',
      cursor: 'pointer',
      ...style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--color-icon-neutral-3)",
    strokeWidth: "2",
    strokeLinecap: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "5",
    width: "18",
    height: "16",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 3v4M16 3v4M3 10h18"
  })), /*#__PURE__*/React.createElement("span", null, from, " ~ ", to));
}
Object.assign(__ds_scope, { DateRangePicker });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/DateRangePicker.jsx", error: String((e && e.message) || e) }); }

// components/forms/FormField.jsx
try { (() => {
/**
 * Labelled form row: 120px fixed label column, required asterisk, control on the
 * right, error message beneath. This is the RequestForm layout primitive.
 */
function FormField({
  label,
  required = false,
  error,
  hint,
  children,
  labelWidth = 120,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: labelWidth,
      flexShrink: 0,
      paddingTop: 8,
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--font-weight-semibold)',
      color: 'var(--color-text-neutral-6)'
    }
  }, label, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--color-status-error)'
    }
  }, " *")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, children, hint && !error && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      fontSize: 'var(--text-xs)',
      color: 'var(--color-text-neutral-2)'
    }
  }, hint), error && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      fontSize: 'var(--text-xs)',
      color: 'var(--color-status-error)'
    }
  }, error)));
}

/** Grouped form section with a semibold title and 1024px max width container. */
function FormGroup({
  title,
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      padding: 20,
      borderRadius: 'var(--radius-control)',
      border: '1px solid var(--color-border-neutral-2)',
      background: 'var(--color-bg-neutral-0)',
      ...style
    }
  }, title && /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--font-weight-semibold)',
      color: 'var(--color-text-neutral-6)'
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, children));
}
Object.assign(__ds_scope, { FormField, FormGroup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/FormField.jsx", error: String((e && e.message) || e) }); }

// components/forms/KeywordSearch.jsx
try { (() => {
/** Search field with leading magnifier and a reset button, as used above every list. */
function KeywordSearch({
  value = '',
  onChange,
  onSearch,
  onReset,
  placeholder = '검색어를 입력하세요',
  width = 300,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 8,
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'var(--color-icon-neutral-3)',
      lineHeight: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M20 20l-4.2-4.2"
  }))), /*#__PURE__*/React.createElement(__ds_scope.Input, {
    value: value,
    placeholder: placeholder,
    style: {
      paddingLeft: 28,
      paddingRight: value ? 26 : 8
    },
    onChange: e => onChange && onChange(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter' && onSearch) onSearch(value);
    }
  }), value && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => onChange && onChange(''),
    "aria-label": "\uC9C0\uC6B0\uAE30",
    style: {
      position: 'absolute',
      right: 6,
      top: '50%',
      transform: 'translateY(-50%)',
      border: 0,
      background: 'none',
      padding: 0,
      cursor: 'pointer',
      color: 'var(--color-icon-neutral-2)',
      lineHeight: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 2a10 10 0 100 20 10 10 0 000-20zm3.5 12.1L14.1 15.5 12 13.4l-2.1 2.1-1.4-1.4L10.6 12 8.5 9.9l1.4-1.4L12 10.6l2.1-2.1 1.4 1.4L13.4 12l2.1 2.1z"
  })))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onReset,
    "aria-label": "\uCD08\uAE30\uD654",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 32,
      height: 32,
      borderRadius: 'var(--radius-control)',
      border: '1px solid var(--color-border-neutral-2)',
      background: 'var(--color-bg-neutral-0)',
      color: 'var(--color-icon-neutral-3)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 12a9 9 0 1015.5-6.4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M20 3v6h-6"
  }))));
}
Object.assign(__ds_scope, { KeywordSearch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/KeywordSearch.jsx", error: String((e && e.message) || e) }); }

// components/forms/MultiSelector.jsx
try { (() => {
/**
 * Filter control that adds values as removable chips. Trigger is a dashed
 * "add" affordance; picked values render as neutral pill chips beside it.
 */
function MultiSelector({
  label = '필터',
  options = [],
  values = [],
  onChange,
  style
}) {
  const [open, setOpen] = React.useState(false);
  const remaining = options.filter(o => !values.includes(o));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 8,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setOpen(o => !o),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      height: 32,
      padding: '0 12px',
      borderRadius: 'var(--radius-control)',
      border: '1px dashed var(--color-border-neutral-3)',
      background: 'var(--color-bg-neutral-0)',
      fontFamily: 'var(--font-pretendard)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--font-weight-semibold)',
      color: 'var(--color-text-neutral-3)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 8v8M8 12h8"
  })), /*#__PURE__*/React.createElement("span", null, label)), open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 'calc(100% + 4px)',
      left: 0,
      zIndex: 30,
      minWidth: 180,
      padding: 4,
      borderRadius: 'var(--radius-control)',
      border: '1px solid var(--color-border-neutral-2)',
      background: 'var(--color-bg-neutral-0)',
      boxShadow: 'var(--shadow-md)'
    }
  }, remaining.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 12px',
      fontSize: 'var(--text-sm)',
      color: 'var(--color-text-neutral-2)'
    }
  }, "\uC120\uD0DD\uD560 \uD56D\uBAA9\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.") : remaining.map(o => /*#__PURE__*/React.createElement("div", {
    key: o,
    onClick: () => {
      onChange && onChange([...values, o]);
      setOpen(false);
    },
    style: {
      padding: '8px 12px',
      borderRadius: 'var(--radius-xs)',
      fontSize: 'var(--text-sm)',
      cursor: 'pointer'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'var(--color-bg-neutral-2)',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent'
  }, o)))), values.map(v => /*#__PURE__*/React.createElement(__ds_scope.Chip, {
    key: v,
    onRemove: () => onChange && onChange(values.filter(x => x !== v))
  }, v)));
}
Object.assign(__ds_scope, { MultiSelector });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/MultiSelector.jsx", error: String((e && e.message) || e) }); }

// components/layout/Breadcrumbs.jsx
try { (() => {
/** Chevron-separated path trail; the last crumb is the current page and is not a link. */
function Breadcrumbs({
  items = [],
  style
}) {
  return /*#__PURE__*/React.createElement("nav", {
    "aria-label": "breadcrumb",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      fontSize: 'var(--text-xs)',
      color: 'var(--color-text-neutral-3)',
      ...style
    }
  }, items.map((item, i) => {
    const last = i === items.length - 1;
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: item.label + i
    }, last ? /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--color-text-neutral-4)',
        fontWeight: 'var(--font-weight-semibold)'
      }
    }, item.label) : /*#__PURE__*/React.createElement("a", {
      href: item.href || '#',
      style: {
        color: 'inherit'
      }
    }, item.label), !last && /*#__PURE__*/React.createElement("svg", {
      width: "12",
      height: "12",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2.5",
      strokeLinecap: "round",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M9 6l6 6-6 6"
    })));
  }));
}
Object.assign(__ds_scope, { Breadcrumbs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/Breadcrumbs.jsx", error: String((e && e.message) || e) }); }

// components/layout/ContentLayout.jsx
try { (() => {
/** Page frame: 1280px max content width, 20px gutter, 40px stack gap between sections. */
function ContentLayout({
  title,
  actions,
  tabs,
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: 'var(--size-content-width)',
      margin: '0 auto',
      padding: '0 var(--common-padding)',
      ...style
    }
  }, (title || actions || tabs) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      paddingTop: 24
    }
  }, (title || actions) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 16
    }
  }, title && /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 'var(--text-xl)',
      lineHeight: 'var(--leading-xl)',
      fontWeight: 'var(--font-weight-bold)'
    }
  }, title), actions && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, actions)), tabs), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--content-container-gap)',
      paddingBottom: 40
    }
  }, children));
}
Object.assign(__ds_scope, { ContentLayout });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/ContentLayout.jsx", error: String((e && e.message) || e) }); }

// components/layout/Dialog.jsx
try { (() => {
/** Centred modal on a dim scrim: 12px radius, 700px max width, 24px padding, right-aligned footer. */
function Dialog({
  open = true,
  title,
  description,
  children,
  footer,
  onClose,
  width = 700,
  style
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      display: 'grid',
      placeItems: 'center',
      background: 'var(--overlay-bg)'
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    onClick: e => e.stopPropagation(),
    style: {
      width: `min(${width}px, calc(100vw - 32px))`,
      padding: 24,
      borderRadius: 'var(--radius-md)',
      background: 'var(--color-bg-neutral-0)',
      boxShadow: 'var(--shadow-md)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, title && /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: 'var(--text-xl)',
      lineHeight: 'var(--leading-xl)',
      fontWeight: 'var(--font-weight-bold)'
    }
  }, title), description && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm)',
      color: 'var(--color-text-neutral-3)'
    }
  }, description)), onClose && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClose,
    "aria-label": "\uB2EB\uAE30",
    style: {
      border: 0,
      background: 'none',
      padding: 4,
      cursor: 'pointer',
      color: 'var(--color-icon-neutral-3)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 6l12 12M18 6L6 18"
  })))), children && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20,
      fontSize: 'var(--text-sm)',
      color: 'var(--color-text-neutral-6)'
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 8,
      marginTop: 24
    }
  }, footer)));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/layout/Pagination.jsx
try { (() => {
function Arrow({
  dir
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: dir === 'left' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'
  }));
}

/** Numbered pager with chevron steppers. Current page is filled black. */
function Pagination({
  page = 1,
  totalPages = 1,
  onChange,
  style
}) {
  const pages = [];
  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  for (let i = start; i < start + 5 && i <= totalPages; i++) pages.push(i);
  const go = p => onChange && p >= 1 && p <= totalPages && onChange(p);
  const btn = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    border: 0,
    background: 'none',
    borderRadius: 'var(--radius-xs)',
    fontFamily: 'var(--font-pretendard)',
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-neutral-3)',
    cursor: 'pointer'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      ...style
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: btn,
    onClick: () => go(page - 1),
    "aria-label": "\uC774\uC804"
  }, /*#__PURE__*/React.createElement(Arrow, {
    dir: "left"
  })), pages.map(p => /*#__PURE__*/React.createElement("button", {
    key: p,
    type: "button",
    onClick: () => go(p),
    "aria-current": p === page || undefined,
    style: {
      ...btn,
      background: p === page ? 'var(--color-secondary)' : 'none',
      color: p === page ? '#fff' : btn.color,
      fontWeight: p === page ? 'var(--font-weight-semibold)' : 400
    }
  }, p)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: btn,
    onClick: () => go(page + 1),
    "aria-label": "\uB2E4\uC74C"
  }, /*#__PURE__*/React.createElement(Arrow, {
    dir: "right"
  })));
}
Object.assign(__ds_scope, { Pagination });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/Pagination.jsx", error: String((e && e.message) || e) }); }

// components/layout/SectionLayout.jsx
try { (() => {
/** Titled section card: white surface, hairline border, 8px radius, 20px padding, sm shadow. */
function SectionLayout({
  title,
  description,
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: '100%',
      padding: 20,
      borderRadius: 'var(--radius-sm)',
      border: '1px solid var(--color-border-neutral-2)',
      background: 'var(--color-bg-neutral-0)',
      boxShadow: 'var(--shadow-sm)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 'var(--text-base)',
      lineHeight: 'var(--leading-base)',
      fontWeight: 'var(--font-weight-bold)',
      color: 'var(--color-text-neutral-6)'
    }
  }, title), description && /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--color-text-neutral-2)',
      fontSize: 'var(--text-base)',
      lineHeight: 'var(--leading-base)',
      fontWeight: 'var(--font-weight-medium)',
      whiteSpace: 'pre-line'
    }
  }, description)), children);
}
Object.assign(__ds_scope, { SectionLayout });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/SectionLayout.jsx", error: String((e && e.message) || e) }); }

// components/layout/SidePanel.jsx
try { (() => {
/** Right-hand slide-over panel used for record detail. Default width 400px. */
function SidePanel({
  open = true,
  title,
  children,
  footer,
  onClose,
  width = 400,
  style
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      width,
      height: '100%',
      background: 'var(--color-bg-neutral-0)',
      borderLeft: '1px solid var(--color-border-neutral-2)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      height: 52,
      minHeight: 52,
      padding: '0 20px',
      borderBottom: '1px solid var(--color-border-neutral-1)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--font-weight-bold)'
    }
  }, title), onClose && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClose,
    "aria-label": "\uB2EB\uAE30",
    style: {
      border: 0,
      background: 'none',
      padding: 4,
      cursor: 'pointer',
      color: 'var(--color-icon-neutral-3)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 6l12 12M18 6L6 18"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "show-scrollbar",
    style: {
      flex: 1,
      minHeight: 0,
      overflowY: 'auto',
      padding: 20
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 8,
      padding: 16,
      borderTop: '1px solid var(--color-border-neutral-1)'
    }
  }, footer));
}
Object.assign(__ds_scope, { SidePanel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/SidePanel.jsx", error: String((e && e.message) || e) }); }

// components/layout/SidebarNav.jsx
try { (() => {
/**
 * 250px fixed left rail. Group labels are 12px neutral-3; items are 32px rows
 * with a 4px radius and a neutral-200 fill when active. Sub-items sit behind a
 * left hairline and indent by 14px.
 */
function SidebarNav({
  groups = [],
  activeHref,
  onNavigate,
  header,
  footer,
  style
}) {
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      width: 'var(--sidebar-width)',
      flexShrink: 0,
      height: '100%',
      background: 'var(--color-bg-neutral-0)',
      borderRight: '1px solid var(--color-border-gray)',
      ...style
    }
  }, header && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      height: 'var(--header-height)',
      minHeight: 'var(--header-height)',
      paddingLeft: 20,
      borderBottom: '1px solid var(--color-border-gray)'
    }
  }, header), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      minHeight: 0,
      overflowY: 'auto',
      gap: 8,
      padding: 0
    }
  }, groups.map(group => /*#__PURE__*/React.createElement("div", {
    key: group.label,
    style: {
      display: 'flex',
      flexDirection: 'column',
      padding: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      height: 32,
      padding: '0 8px',
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--font-weight-medium)',
      color: 'var(--color-text-neutral-3)'
    }
  }, group.label), /*#__PURE__*/React.createElement("ul", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      margin: 0,
      padding: 0,
      listStyle: 'none'
    }
  }, group.items.map(item => /*#__PURE__*/React.createElement(NavItem, {
    key: item.label,
    item: item,
    activeHref: activeHref,
    onNavigate: onNavigate
  })))))), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--color-border-neutral-2)',
      padding: 8
    }
  }, footer));
}
function NavItem({
  item,
  activeHref,
  onNavigate
}) {
  const hasSub = item.items && item.items.length > 0;
  const [open, setOpen] = React.useState(true);
  const active = item.href === activeHref;
  const row = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    height: 32,
    padding: 8,
    border: 0,
    borderRadius: 'var(--radius-xs)',
    fontFamily: 'var(--font-pretendard)',
    fontSize: 'var(--text-sm)',
    textAlign: 'left',
    color: 'var(--color-text-neutral-6)',
    cursor: 'pointer'
  };
  return /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => hasSub ? setOpen(o => !o) : onNavigate && onNavigate(item.href),
    style: {
      ...row,
      background: active ? 'var(--color-neutral-200)' : 'transparent',
      fontWeight: active ? 'var(--font-weight-medium)' : 400
    },
    onMouseEnter: e => {
      if (!active) e.currentTarget.style.background = 'var(--color-neutral-200)';
    },
    onMouseLeave: e => {
      if (!active) e.currentTarget.style.background = 'transparent';
    }
  }, item.icon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      width: 16,
      height: 16,
      color: 'var(--color-icon-neutral-4)'
    }
  }, item.icon), /*#__PURE__*/React.createElement("span", {
    style: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, item.label), hasSub && /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    style: {
      marginLeft: 'auto',
      transform: open ? 'rotate(180deg)' : 'none',
      transition: 'transform var(--duration-normal) var(--ease-out)'
    },
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 9l6 6 6-6"
  }))), hasSub && open && /*#__PURE__*/React.createElement("ul", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      margin: '4px 0 4px 14px',
      padding: '2px 0 2px 10px',
      listStyle: 'none',
      borderLeft: '1px solid var(--color-neutral-200)'
    }
  }, item.items.map(sub => {
    const on = sub.href === activeHref;
    return /*#__PURE__*/React.createElement("li", {
      key: sub.label
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => onNavigate && onNavigate(sub.href),
      style: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        height: 28,
        padding: '0 8px',
        border: 0,
        borderRadius: 'var(--radius-xs)',
        background: on ? 'var(--color-neutral-200)' : 'transparent',
        fontFamily: 'var(--font-pretendard)',
        fontSize: 'var(--text-sm)',
        color: 'var(--color-text-neutral-6)',
        textAlign: 'left',
        cursor: 'pointer'
      },
      onMouseEnter: e => {
        if (!on) e.currentTarget.style.background = 'var(--color-neutral-200)';
      },
      onMouseLeave: e => {
        if (!on) e.currentTarget.style.background = 'transparent';
      }
    }, sub.label));
  })));
}
Object.assign(__ds_scope, { SidebarNav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/SidebarNav.jsx", error: String((e && e.message) || e) }); }

// components/layout/SubTabs.jsx
try { (() => {
/** Underlined tab row; the active tab gets a 2px magenta rule and black label. */
function SubTabs({
  items = [],
  value,
  onChange,
  style
}) {
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      ...style
    }
  }, /*#__PURE__*/React.createElement("ul", {
    style: {
      display: 'flex',
      gap: 24,
      margin: 0,
      padding: 0,
      listStyle: 'none',
      borderBottom: '1px solid var(--color-border-neutral-2)'
    }
  }, items.map(item => {
    const key = item.value ?? item.label;
    const on = key === value;
    return /*#__PURE__*/React.createElement("li", {
      key: key
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => onChange && onChange(key),
      style: {
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        height: 52,
        padding: '0 12px',
        border: 0,
        background: 'none',
        fontFamily: 'var(--font-pretendard)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-weight-semibold)',
        color: on ? 'var(--color-secondary)' : 'var(--color-text-neutral-3)',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("span", null, item.label), item.count !== undefined && /*#__PURE__*/React.createElement("span", {
      style: {
        minWidth: 25,
        padding: '4px 8px',
        borderRadius: 'var(--radius-xs)',
        background: 'var(--color-bg-neutral-2)',
        color: 'var(--color-text-neutral-3)',
        fontSize: 'var(--text-xs)',
        fontWeight: 400
      }
    }, item.count), on && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 2,
        background: 'var(--color-primary)'
      }
    })));
  })));
}
Object.assign(__ds_scope, { SubTabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/SubTabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/cms-admin/CmsScreens.jsx
try { (() => {
const DS = window.UCMPDesignSystem_ec5463;
const {
  ContentLayout,
  SectionLayout,
  SubTabs,
  Table,
  Button,
  KeywordSearch,
  MultiSelector,
  Pagination,
  CSPIcon,
  StatusBadge,
  Tag,
  Dialog,
  FormGroup,
  FormField,
  Input,
  Select,
  Checkbox,
  ToggleSwitch,
  GuidePanel,
  StatCard,
  DetailListItem,
  Toast,
  ErrorNotice,
  CountBadge
} = DS;
const BASE = '../../';
const SYSTEMS = [{
  id: 1,
  name: '통합서비스포털',
  code: 'UCMP-SVC-001',
  tenant: 'LGU-CORP',
  msp: 'MSP-A',
  csp: 'AWS',
  accounts: 6,
  tone: 'success',
  s: '운영'
}, {
  id: 2,
  name: '모바일게이트웨이',
  code: 'UCMP-SVC-014',
  tenant: 'LGU-CORP',
  msp: 'MSP-A',
  csp: 'AWS',
  accounts: 4,
  tone: 'success',
  s: '운영'
}, {
  id: 3,
  name: 'AI음성분석',
  code: 'UCMP-SVC-027',
  tenant: 'LGU-AI',
  msp: 'MSP-B',
  csp: 'GCP',
  accounts: 3,
  tone: 'progress',
  s: '구축'
}, {
  id: 4,
  name: '사내데이터플랫폼',
  code: 'UCMP-SVC-031',
  tenant: 'LGU-CORP',
  msp: 'MSP-C',
  csp: 'AZURE',
  accounts: 2,
  tone: 'success',
  s: '운영'
}, {
  id: 5,
  name: '고객상담봇',
  code: 'UCMP-SVC-042',
  tenant: 'LGU-CX',
  msp: 'MSP-B',
  csp: 'AWS',
  accounts: 1,
  tone: 'error',
  s: '중단'
}];

/** 시스템 목록 — the CMS landing view: filter row, table, add-system modal. */
function SystemsScreen({
  tab,
  onTab
}) {
  const [q, setQ] = React.useState('');
  const [csps, setCsps] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [add, setAdd] = React.useState(false);
  const [toast, setToast] = React.useState(false);
  const rows = SYSTEMS.filter(r => (!q || r.name.includes(q) || r.code.includes(q)) && (csps.length === 0 || csps.includes(r.csp)));
  return /*#__PURE__*/React.createElement(ContentLayout, {
    title: "\uC2DC\uC2A4\uD15C \uBAA9\uB85D",
    actions: /*#__PURE__*/React.createElement(Button, {
      variant: "secondary-solid",
      size: "sm",
      onClick: () => setAdd(true)
    }, "\uC2DC\uC2A4\uD15C \uB4F1\uB85D"),
    tabs: /*#__PURE__*/React.createElement(SubTabs, {
      value: tab,
      onChange: onTab,
      items: [{
        label: '시스템 목록',
        value: 'systems',
        count: SYSTEMS.length
      }, {
        label: 'Tenant 관리',
        value: 'tenant',
        count: 3
      }, {
        label: 'MSP 관리',
        value: 'msp',
        count: 3
      }]
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    label: "\uB4F1\uB85D \uC2DC\uC2A4\uD15C",
    value: "42",
    unit: "\uAC1C",
    footnote: "\uC6B4\uC601 36 \xB7 \uAD6C\uCD95 4 \xB7 \uC911\uB2E8 2"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "\uC5F0\uACB0 \uACC4\uC815",
    value: "187",
    unit: "\uAC1C",
    footnote: "AWS 121 \xB7 Azure 34 \xB7 GCP 32"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "\uBBF8\uCC98\uB9AC \uC791\uC5C5",
    value: "3",
    unit: "\uAC74",
    delta: "+2",
    deltaTone: "up",
    footnote: "24\uC2DC\uAC04 \uC774\uB0B4"
  })), /*#__PURE__*/React.createElement(SectionLayout, {
    title: "\uC2DC\uC2A4\uD15C",
    description: "\uD37C\uBE14\uB9AD \uD074\uB77C\uC6B0\uB4DC \uC2DC\uC2A4\uD15C\uACFC \uC5F0\uACB0\uB41C \uACC4\uC815\uC744 \uAD00\uB9AC\uD569\uB2C8\uB2E4."
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(KeywordSearch, {
    value: q,
    onChange: setQ,
    placeholder: "\uC2DC\uC2A4\uD15C\uBA85 \uB610\uB294 \uCF54\uB4DC",
    width: 280,
    onReset: () => {
      setQ('');
      setCsps([]);
    }
  }), /*#__PURE__*/React.createElement(MultiSelector, {
    label: "CSP",
    options: ['AWS', 'AZURE', 'GCP'],
    values: csps,
    onChange: setCsps
  })), rows.length === 0 ? /*#__PURE__*/React.createElement(ErrorNotice, {
    assetBase: BASE,
    title: "\uC870\uD68C \uACB0\uACFC\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.",
    description: "\uAC80\uC0C9 \uC870\uAC74\uC744 \uBCC0\uACBD\uD574 \uBCF4\uC138\uC694."
  }) : /*#__PURE__*/React.createElement(Table, {
    columns: [{
      key: 'name',
      header: '시스템명',
      render: r => /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: 'var(--font-weight-semibold)'
        }
      }, r.name), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-neutral-2)',
          fontVariantNumeric: 'tabular-nums'
        }
      }, r.code))
    }, {
      key: 'tenant',
      header: 'Tenant',
      render: r => /*#__PURE__*/React.createElement(Tag, null, r.tenant)
    }, {
      key: 'msp',
      header: 'MSP',
      width: 90
    }, {
      key: 'csp',
      header: 'CSP',
      width: 64,
      render: r => /*#__PURE__*/React.createElement(CSPIcon, {
        csp: r.csp,
        assetBase: BASE
      })
    }, {
      key: 'accounts',
      header: '계정',
      align: 'right',
      width: 70,
      render: r => /*#__PURE__*/React.createElement("span", {
        style: {
          fontVariantNumeric: 'tabular-nums'
        }
      }, r.accounts)
    }, {
      key: 's',
      header: '상태',
      width: 90,
      render: r => /*#__PURE__*/React.createElement(StatusBadge, {
        tone: r.tone
      }, r.s)
    }],
    rows: rows
  }), /*#__PURE__*/React.createElement(Pagination, {
    page: page,
    totalPages: 9,
    onChange: setPage
  }))), /*#__PURE__*/React.createElement(Dialog, {
    open: add,
    onClose: () => setAdd(false),
    width: 620,
    title: "\uC2DC\uC2A4\uD15C \uB4F1\uB85D",
    description: "\uC2DC\uC2A4\uD15C \uAE30\uBCF8 \uC815\uBCF4\uB97C \uC785\uB825\uD558\uBA74 \uACC4\uC815 \uC5F0\uACB0 \uB2E8\uACC4\uB85C \uC774\uC5B4\uC9D1\uB2C8\uB2E4.",
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary-outline",
      size: "sm",
      onClick: () => setAdd(false)
    }, "\uCDE8\uC18C"), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary-solid",
      size: "sm",
      onClick: () => {
        setAdd(false);
        setToast(true);
        setTimeout(() => setToast(false), 2000);
      }
    }, "\uB4F1\uB85D"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(FormField, {
    label: "\uC2DC\uC2A4\uD15C\uBA85",
    required: true
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "\uC2DC\uC2A4\uD15C\uBA85\uC744 \uC785\uB825\uD558\uC138\uC694"
  })), /*#__PURE__*/React.createElement(FormField, {
    label: "Tenant",
    required: true
  }, /*#__PURE__*/React.createElement(Select, {
    value: "LGU-CORP",
    options: ['LGU-CORP', 'LGU-AI', 'LGU-CX'],
    width: 240
  })), /*#__PURE__*/React.createElement(FormField, {
    label: "MSP"
  }, /*#__PURE__*/React.createElement(Select, {
    value: "MSP-A",
    options: ['MSP-A', 'MSP-B', 'MSP-C'],
    width: 240
  })), /*#__PURE__*/React.createElement(FormField, {
    label: "CSP",
    required: true
  }, /*#__PURE__*/React.createElement(Select, {
    value: "AWS",
    options: ['AWS', 'AZURE', 'GCP'],
    width: 240
  })), /*#__PURE__*/React.createElement(FormField, {
    label: "\uC635\uC158"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    checked: true,
    onChange: () => {},
    label: "FinOps \uC218\uC9D1 \uB300\uC0C1\uC5D0 \uD3EC\uD568"
  })))), toast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      bottom: 32,
      left: 0,
      right: 0,
      display: 'grid',
      placeItems: 'center',
      zIndex: 60
    }
  }, /*#__PURE__*/React.createElement(Toast, {
    tone: "success"
  }, "\uC2DC\uC2A4\uD15C\uC774 \uB4F1\uB85D\uB418\uC5C8\uC2B5\uB2C8\uB2E4.")));
}
const ROLES = [{
  id: 1,
  role: 'Admin',
  desc: 'UCMP 전체 관리',
  users: 6,
  paths: 42
}, {
  id: 2,
  role: 'Member',
  desc: '소속 서비스 조회 및 요청',
  users: 812,
  paths: 28
}, {
  id: 3,
  role: 'Partners',
  desc: '협력사 권한 요청',
  users: 137,
  paths: 9
}, {
  id: 4,
  role: 'CloudMigration',
  desc: '전환 에이전트 사용',
  users: 24,
  paths: 12
}];

/** RBAC 관리 — role table with per-path switches, the CMS's densest control screen. */
function RbacScreen({
  tab,
  onTab
}) {
  const [row, setRow] = React.useState(ROLES[0]);
  const [perms, setPerms] = React.useState({
    finops: true,
    security: true,
    migration: false,
    cms: false
  });
  return /*#__PURE__*/React.createElement(ContentLayout, {
    title: "RBAC \uAD00\uB9AC",
    tabs: /*#__PURE__*/React.createElement(SubTabs, {
      value: tab,
      onChange: onTab,
      items: [{
        label: 'RBAC 관리',
        value: 'rbac'
      }, {
        label: '사용자 관리',
        value: 'users',
        count: 979
      }]
    })
  }, /*#__PURE__*/React.createElement(GuidePanel, {
    tone: "warning",
    title: "\uBCC0\uACBD \uC989\uC2DC \uBC18\uC601"
  }, "RBAC \uBCC0\uACBD\uC740 \uC800\uC7A5 \uC989\uC2DC \uBAA8\uB4E0 \uC0AC\uC6A9\uC790\uC5D0\uAC8C \uBC18\uC601\uB3FC\uC694. \uACBD\uB85C \uC811\uADFC\uC744 \uD68C\uC218\uD558\uBA74 \uD574\uB2F9 \uBA54\uB274\uAC00 \uC0AC\uC774\uB4DC\uBC14\uC5D0\uC11C \uC0AC\uB77C\uC9D1\uB2C8\uB2E4."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.3fr 1fr',
      gap: 16,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(SectionLayout, {
    title: "Role",
    description: "\uC5ED\uD560\uBCC4 \uC0AC\uC6A9\uC790 \uC218\uC640 \uC811\uADFC \uACBD\uB85C \uC218\uC785\uB2C8\uB2E4."
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(Table, {
    onRowClick: setRow,
    columns: [{
      key: 'role',
      header: 'Role',
      render: r => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: 'var(--font-weight-semibold)'
        }
      }, r.role)
    }, {
      key: 'desc',
      header: '설명',
      render: r => /*#__PURE__*/React.createElement("span", {
        style: {
          color: 'var(--color-text-neutral-3)'
        }
      }, r.desc)
    }, {
      key: 'users',
      header: '사용자',
      align: 'right',
      width: 80,
      render: r => /*#__PURE__*/React.createElement("span", {
        style: {
          fontVariantNumeric: 'tabular-nums'
        }
      }, r.users)
    }, {
      key: 'paths',
      header: '경로',
      align: 'right',
      width: 70,
      render: r => /*#__PURE__*/React.createElement("span", {
        style: {
          fontVariantNumeric: 'tabular-nums'
        }
      }, r.paths)
    }],
    rows: ROLES
  }))), /*#__PURE__*/React.createElement(SectionLayout, {
    title: `${row.role} 접근 경로`,
    description: "\uC774 \uC5ED\uD560\uC774 \uC811\uADFC\uD560 \uC218 \uC788\uB294 \uBA54\uB274\uC785\uB2C8\uB2E4."
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(DetailListItem, {
    label: "\uC0AC\uC6A9\uC790 \uC218"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8
    }
  }, row.users, "\uBA85 ", /*#__PURE__*/React.createElement(CountBadge, null, row.paths))), [['finops', '클라우드 비용'], ['security', '애플리케이션 보안'], ['migration', '클라우드 전환 에이전트'], ['cms', 'CMS 백오피스']].map(([k, label]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      padding: '10px 0',
      borderBottom: '1px solid var(--color-border-neutral-1)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--color-text-neutral-6)'
    }
  }, label), /*#__PURE__*/React.createElement(ToggleSwitch, {
    checked: perms[k],
    onChange: v => setPerms(p => ({
      ...p,
      [k]: v
    }))
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary-solid",
    size: "sm"
  }, "\uC800\uC7A5"))))));
}
Object.assign(window, {
  SystemsScreen,
  RbacScreen,
  SYSTEMS,
  ROLES
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/cms-admin/CmsScreens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/cms-admin/CmsShell.jsx
try { (() => {
const DS = window.UCMPDesignSystem_ec5463;
const {
  Logo,
  Avatar,
  Breadcrumbs,
  SidebarNav
} = DS;
const CMS_BASE = '../../';

/** CMS navigation, copied from CMS_SIDE_NAV_GROUPS in consts/sideNavItem.ts.
    The back-office rail has no icons — labels only. */
const CMS_NAV = [{
  label: '퍼블릭 클라우드 관리',
  items: [{
    label: '시스템 목록',
    href: 'systems'
  }, {
    label: 'Tenant 관리',
    href: 'tenant'
  }, {
    label: 'MSP 관리',
    href: 'msp'
  }, {
    label: '작업 목록',
    href: 'tasks'
  }, {
    label: '권한 스위칭',
    href: 'switch'
  }, {
    label: 'FinOps',
    items: [{
      label: '수집 스케줄 관리',
      href: 'finops-schedule'
    }, {
      label: '리포트 발행 관리',
      href: 'finops-report'
    }]
  }]
}, {
  label: 'UCMP 관리',
  items: [{
    label: 'Batch 작업 목록',
    href: 'batch'
  }, {
    label: '취약점 가이드 관리',
    href: 'guide'
  }, {
    label: 'RBAC 관리',
    href: 'rbac'
  }, {
    label: '사용자 관리',
    href: 'users'
  }]
}, {
  label: '인벤토리',
  items: [{
    label: '프롬프트 관리',
    href: 'prompt'
  }, {
    label: '인벤토리 이벤트 관리',
    href: 'inv-event'
  }, {
    label: '인벤토리 변경 분석',
    href: 'inv-change'
  }]
}, {
  label: '로그',
  items: [{
    label: '서비스 인벤토리 로그',
    href: 'log-service'
  }, {
    label: 'AWS 계정 로그',
    href: 'log-aws'
  }, {
    label: 'CMS 접속 로그',
    href: 'log-user'
  }]
}];

/** Same shell geometry as the service console, with a CMS badge beside the mark. */
function CmsShell({
  route,
  onNavigate,
  crumbs,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      height: '100%',
      minHeight: 0,
      background: 'var(--color-bg-neutral-0)'
    }
  }, /*#__PURE__*/React.createElement(SidebarNav, {
    groups: CMS_NAV,
    activeHref: route,
    onNavigate: onNavigate,
    header: /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Logo, {
      assetBase: CMS_BASE
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        padding: '2px 6px',
        borderRadius: 'var(--radius-xs)',
        background: 'var(--color-secondary)',
        color: '#fff',
        fontSize: 10,
        fontWeight: 'var(--font-weight-bold)',
        letterSpacing: '0.06em'
      }
    }, "CMS"))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      height: 'var(--header-height)',
      minHeight: 'var(--header-height)',
      padding: '0 20px',
      borderBottom: '1px solid var(--color-border-gray)'
    }
  }, crumbs ? /*#__PURE__*/React.createElement(Breadcrumbs, {
    items: crumbs
  }) : /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--color-text-neutral-4)'
    }
  }, "\uC6B4\uC601\uC790", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--color-text-neutral-2)'
    }
  }, " UCMP\uC6B4\uC601\uD300")), /*#__PURE__*/React.createElement(Avatar, {
    name: "\uC6B4\uC601\uC790",
    size: 28
  }))), /*#__PURE__*/React.createElement("main", {
    className: "show-scrollbar",
    style: {
      flex: 1,
      minHeight: 0,
      overflowY: 'auto'
    }
  }, children)));
}
Object.assign(window, {
  CmsShell,
  CMS_NAV,
  CMS_BASE
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/cms-admin/CmsShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/service-console/AccountsScreen.jsx
try { (() => {
const DS = window.UCMPDesignSystem_ec5463;
const {
  ContentLayout,
  SectionLayout,
  SubTabs,
  Table,
  Button,
  KeywordSearch,
  MultiSelector,
  Pagination,
  CSPIcon,
  StatusBadge,
  Chip,
  Tag,
  SidePanel,
  DetailListItem,
  UserInfoCard,
  Dialog,
  ErrorNotice,
  GuidePanel,
  ToggleSwitch,
  CountBadge
} = DS;
const BASE = '../../';
const ACCOUNTS = [{
  id: 1,
  name: '통합서비스포털',
  team: '클라우드기술팀',
  csp: 'AWS',
  account: '1234-5678-9012',
  env: 'prod',
  owner: '김서연',
  tone: 'success',
  status: '정상'
}, {
  id: 2,
  name: '모바일게이트웨이',
  team: '모바일플랫폼팀',
  csp: 'AWS',
  account: '2345-6789-0123',
  env: 'prod',
  owner: '박지훈',
  tone: 'success',
  status: '정상'
}, {
  id: 3,
  name: 'AI음성분석',
  team: 'AI기술팀',
  csp: 'GCP',
  account: 'ucmp-ai-voice-prd',
  env: 'prod',
  owner: '이하준',
  tone: 'progress',
  status: '생성 중'
}, {
  id: 4,
  name: '사내데이터플랫폼',
  team: '데이터플랫폼팀',
  csp: 'AZURE',
  account: 'sub-8f2a11c4',
  env: 'stg',
  owner: '정민서',
  tone: 'success',
  status: '정상'
}, {
  id: 5,
  name: '고객상담봇',
  team: 'CX개발팀',
  csp: 'AWS',
  account: '3456-7890-1234',
  env: 'dev',
  owner: '최유진',
  tone: 'error',
  status: '실패'
}];

/** 클라우드 계정 / 권한 — list + row detail panel + revoke confirmation. */
function AccountsScreen({
  tab,
  onTab
}) {
  const [q, setQ] = React.useState('');
  const [csps, setCsps] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [row, setRow] = React.useState(null);
  const [confirm, setConfirm] = React.useState(false);
  const [autoRevoke, setAutoRevoke] = React.useState(true);
  const rows = ACCOUNTS.filter(r => (!q || r.name.includes(q)) && (csps.length === 0 || csps.includes(r.csp)));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      height: '100%',
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 720,
      overflowY: 'auto'
    },
    className: "show-scrollbar"
  }, /*#__PURE__*/React.createElement(ContentLayout, {
    title: "\uD074\uB77C\uC6B0\uB4DC \uACC4\uC815 / \uAD8C\uD55C",
    actions: /*#__PURE__*/React.createElement(Button, {
      variant: "secondary-solid",
      size: "sm",
      onClick: () => onTab('request')
    }, "\uACC4\uC815 \uC0DD\uC131 \uC694\uCCAD"),
    tabs: /*#__PURE__*/React.createElement(SubTabs, {
      value: tab,
      onChange: onTab,
      items: [{
        label: '서비스 / 계정',
        value: 'accounts',
        count: ACCOUNTS.length
      }, {
        label: '권한',
        value: 'permissions',
        count: 12
      }, {
        label: '작업',
        value: 'tasks',
        count: 3
      }]
    })
  }, /*#__PURE__*/React.createElement(SectionLayout, {
    title: "\uC11C\uBE44\uC2A4 / \uACC4\uC815",
    description: '내가 접근할 수 있는 서비스와 퍼블릭 클라우드 계정입니다.\n계정을 선택하면 상세 정보를 확인할 수 있어요.'
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(KeywordSearch, {
    value: q,
    onChange: setQ,
    placeholder: "\uC11C\uBE44\uC2A4\uBA85\uC744 \uC785\uB825\uD558\uC138\uC694",
    width: 260,
    onReset: () => {
      setQ('');
      setCsps([]);
    }
  }), /*#__PURE__*/React.createElement(MultiSelector, {
    label: "CSP",
    options: ['AWS', 'AZURE', 'GCP'],
    values: csps,
    onChange: setCsps
  })), rows.length === 0 ? /*#__PURE__*/React.createElement(ErrorNotice, {
    title: "\uC870\uD68C \uACB0\uACFC\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.",
    description: "\uAC80\uC0C9 \uC870\uAC74\uC744 \uBCC0\uACBD\uD574 \uBCF4\uC138\uC694.",
    assetBase: BASE
  }) : /*#__PURE__*/React.createElement(Table, {
    onRowClick: setRow,
    columns: [{
      key: 'name',
      header: '서비스명',
      render: r => /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: 'var(--font-weight-semibold)'
        }
      }, r.name), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-neutral-2)'
        }
      }, r.team))
    }, {
      key: 'csp',
      header: 'CSP',
      width: 64,
      render: r => /*#__PURE__*/React.createElement(CSPIcon, {
        csp: r.csp,
        assetBase: BASE
      })
    }, {
      key: 'account',
      header: '계정 / 프로젝트',
      render: r => /*#__PURE__*/React.createElement("span", {
        style: {
          fontVariantNumeric: 'tabular-nums'
        }
      }, r.account)
    }, {
      key: 'env',
      header: '환경',
      width: 80,
      render: r => /*#__PURE__*/React.createElement(Tag, null, r.env)
    }, {
      key: 'owner',
      header: '담당자',
      width: 90
    }, {
      key: 'status',
      header: '상태',
      width: 96,
      render: r => /*#__PURE__*/React.createElement(StatusBadge, {
        tone: r.tone
      }, r.status)
    }],
    rows: rows
  }), /*#__PURE__*/React.createElement(Pagination, {
    page: page,
    totalPages: 4,
    onChange: setPage
  }))), /*#__PURE__*/React.createElement(SectionLayout, {
    title: "\uAD8C\uD55C \uC790\uB3D9 \uD68C\uC218",
    description: "\uC624\uB798 \uC0AC\uC6A9\uD558\uC9C0 \uC54A\uC740 \uAD8C\uD55C\uC744 UCMP\uAC00 \uC548\uC804\uD558\uAC8C \uD68C\uC218\uD574\uC694."
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--color-text-neutral-4)'
    }
  }, "90\uC77C\uAC04 \uBBF8\uC0AC\uC6A9 \uAD8C\uD55C \uC790\uB3D9 \uD68C\uC218"), /*#__PURE__*/React.createElement(ToggleSwitch, {
    checked: autoRevoke,
    onChange: setAutoRevoke
  }))), /*#__PURE__*/React.createElement(GuidePanel, {
    tone: "warning",
    title: "\uAD8C\uD55C \uD68C\uC218 \uC608\uC815"
  }, "90\uC77C\uAC04 \uC0AC\uC6A9\uD558\uC9C0 \uC54A\uC740 \uAD8C\uD55C\uC740 UCMP\uAC00 \uC790\uB3D9\uC73C\uB85C \uD68C\uC218\uD574\uC694. \uACC4\uC18D \uC0AC\uC6A9\uD574\uC57C \uD558\uBA74 \uB2F4\uB2F9\uC790\uC5D0\uAC8C \uC5F0\uC7A5\uC744 \uC694\uCCAD\uD574\uC8FC\uC138\uC694."))), row && /*#__PURE__*/React.createElement(SidePanel, {
    open: true,
    title: row.name,
    onClose: () => setRow(null),
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary-outline",
      size: "sm",
      onClick: () => setRow(null)
    }, "\uB2EB\uAE30"), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary-solid",
      size: "sm",
      onClick: () => setConfirm(true)
    }, "\uAD8C\uD55C \uD68C\uC218"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(CSPIcon, {
    csp: row.csp,
    assetBase: BASE
  }), /*#__PURE__*/React.createElement(StatusBadge, {
    tone: row.tone
  }, row.status), /*#__PURE__*/React.createElement(Tag, null, row.env)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(DetailListItem, {
    label: "\uACC4\uC815 / \uD504\uB85C\uC81D\uD2B8"
  }, row.account), /*#__PURE__*/React.createElement(DetailListItem, {
    label: "\uC870\uC9C1"
  }, row.team), /*#__PURE__*/React.createElement(DetailListItem, {
    label: "\uC0DD\uC131\uC77C"
  }, "2026-08-14"), /*#__PURE__*/React.createElement(DetailListItem, {
    label: "\uCD5C\uADFC \uC811\uADFC"
  }, "2026-09-01 09:24")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--font-weight-semibold)'
    }
  }, "\uAD8C\uD55C \uBCF4\uC720\uC790 ", /*#__PURE__*/React.createElement(CountBadge, null, "3")), /*#__PURE__*/React.createElement(UserInfoCard, {
    name: row.owner,
    team: row.team,
    userId: "seoyeon.kim",
    isOwner: true,
    right: /*#__PURE__*/React.createElement(Chip, null, "Admin")
  }), /*#__PURE__*/React.createElement(UserInfoCard, {
    name: "\uBC15\uC9C0\uD6C8",
    team: row.team,
    userId: "jihun.park",
    right: /*#__PURE__*/React.createElement(Chip, null, "Member")
  }), /*#__PURE__*/React.createElement(UserInfoCard, {
    name: "\uC774\uD558\uC900",
    team: "\uD611\uB825\uC0AC",
    userId: "hajun.lee",
    right: /*#__PURE__*/React.createElement(Chip, null, "Partner")
  })))), /*#__PURE__*/React.createElement(Dialog, {
    open: confirm,
    onClose: () => setConfirm(false),
    width: 520,
    title: "\uAD8C\uD55C\uC744 \uD68C\uC218\uD560\uAE4C\uC694?",
    description: "\uD68C\uC218 \uD6C4\uC5D0\uB294 \uB2F4\uB2F9\uC790\uC5D0\uAC8C \uB2E4\uC2DC \uC694\uCCAD\uD574\uC57C \uD569\uB2C8\uB2E4.",
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary-outline",
      size: "sm",
      onClick: () => setConfirm(false)
    }, "\uCDE8\uC18C"), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary-solid",
      size: "sm",
      onClick: () => setConfirm(false)
    }, "\uD68C\uC218"))
  }));
}
Object.assign(window, {
  AccountsScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/service-console/AccountsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/service-console/AppShell.jsx
try { (() => {
const DS = window.UCMPDesignSystem_ec5463;
const {
  Logo,
  Button,
  Avatar,
  Tooltip,
  SidebarNav,
  Breadcrumbs,
  ExternalLinkButton
} = DS;
const BASE = '../../';
const NAV = [{
  label: '클라우드',
  items: [{
    label: '클라우드 계정 / 권한',
    icon: /*#__PURE__*/React.createElement(IconAccount, null),
    items: [{
      label: '서비스 / 계정',
      href: 'accounts'
    }, {
      label: '권한',
      href: 'permissions'
    }, {
      label: '작업',
      href: 'tasks'
    }]
  }, {
    label: '클라우드 비용',
    icon: /*#__PURE__*/React.createElement(IconCost, null),
    items: [{
      label: 'Overview',
      href: 'finops'
    }, {
      label: '서비스별 비용',
      href: 'finops-service'
    }, {
      label: '리소스별 비용',
      href: 'finops-resource'
    }, {
      label: '크레딧 현황',
      href: 'finops-credit'
    }]
  }, {
    label: '클라우드 전환 에이전트',
    icon: /*#__PURE__*/React.createElement(IconMigration, null),
    items: [{
      label: '인터뷰 에이전트',
      href: 'migration-interview'
    }, {
      label: '코드 분석 에이전트',
      href: 'migration-atx'
    }]
  }]
}, {
  label: '대시보드',
  items: [{
    label: '서비스 대시보드',
    icon: /*#__PURE__*/React.createElement(IconApps, null),
    href: 'dashboard'
  }]
}, {
  label: '보안',
  items: [{
    label: '애플리케이션 보안',
    icon: /*#__PURE__*/React.createElement(IconShield, null),
    href: 'security'
  }]
}, {
  label: '저장소',
  items: [{
    label: 'Github 관리',
    icon: /*#__PURE__*/React.createElement(IconGithub, null),
    href: 'github'
  }]
}];

/* Icons stand in for the react-icons glyphs the product imports (md/fa6/fi/gr/tb/bs).
   Stroke weight and 16px box match those sets. */
function IconAccount() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "9",
    y: "3",
    width: "6",
    height: "5",
    rx: "1"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "16",
    width: "6",
    height: "5",
    rx: "1"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "16",
    y: "16",
    width: "6",
    height: "5",
    rx: "1"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 8v4M5 16v-2h14v2"
  }));
}
function IconCost() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 3v9h9"
  }));
}
function IconMigration() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 15a4 4 0 014-4 5 5 0 019.6-1.2A3.5 3.5 0 0119 17H8a4 4 0 01-4-2z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 20v-7M9.5 15.5L12 13l2.5 2.5"
  }));
}
function IconApps() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "3",
    width: "7",
    height: "7",
    rx: "2"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14",
    y: "3",
    width: "7",
    height: "7",
    rx: "2"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "14",
    width: "7",
    height: "7",
    rx: "2"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14",
    y: "14",
    width: "7",
    height: "7",
    rx: "2"
  }));
}
function IconShield() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 3l8 3v6c0 5-3.4 8.2-8 9-4.6-.8-8-4-8-9V6l8-3z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9.5 11.5L11 13l3.5-3.5"
  }));
}
function IconGithub() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 015 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0012 2z"
  }));
}
function IconDoc() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 3h8l4 4v14H6z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14 3v4h4M9 12h6M9 16h6"
  }));
}
function IconBook() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 5a2 2 0 012-2h5v18H6a2 2 0 01-2-2z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M20 5a2 2 0 00-2-2h-5v18h5a2 2 0 002-2z"
  }));
}

/** Authenticated console shell: 250px rail, 52px header, 1280px content column. */
function AppShell({
  route,
  onNavigate,
  crumbs,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      height: '100%',
      minHeight: 0,
      background: 'var(--color-bg-neutral-0)'
    }
  }, /*#__PURE__*/React.createElement(SidebarNav, {
    groups: NAV,
    activeHref: route,
    onNavigate: onNavigate,
    header: /*#__PURE__*/React.createElement("span", {
      onClick: () => onNavigate('home'),
      style: {
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Logo, {
      assetBase: BASE
    })),
    footer: /*#__PURE__*/React.createElement("a", {
      href: "#",
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        height: 32,
        padding: 8,
        borderRadius: 'var(--radius-xs)',
        fontSize: 'var(--text-sm)',
        color: 'var(--color-text-neutral-6)'
      }
    }, /*#__PURE__*/React.createElement(IconDoc, null), /*#__PURE__*/React.createElement("span", null, "\uAC00\uC774\uB4DC \uBB38\uC11C"), /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 'auto',
        color: 'var(--color-icon-neutral-3)'
      }
    }, "\u2197"))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      height: 'var(--header-height)',
      minHeight: 'var(--header-height)',
      padding: '0 20px',
      borderBottom: '1px solid var(--color-border-gray)'
    }
  }, crumbs ? /*#__PURE__*/React.createElement(Breadcrumbs, {
    items: crumbs
  }) : /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Tooltip, {
    content: "\uAC00\uC774\uB4DC \uBB38\uC11C"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--color-icon-neutral-3)',
      display: 'inline-flex'
    }
  }, /*#__PURE__*/React.createElement(IconBook, null))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--color-text-neutral-4)'
    }
  }, "\uAE40\uC11C\uC5F0", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--color-text-neutral-2)',
      fontWeight: 400
    }
  }, " \uD074\uB77C\uC6B0\uB4DC\uAE30\uC220\uD300")), /*#__PURE__*/React.createElement(Avatar, {
    name: "\uAE40\uC11C\uC5F0",
    size: 28
  }))), /*#__PURE__*/React.createElement("main", {
    className: "show-scrollbar",
    style: {
      flex: 1,
      minHeight: 0,
      overflowY: 'auto',
      background: 'var(--color-bg-neutral-0)'
    }
  }, children)));
}
Object.assign(window, {
  AppShell,
  NAV,
  IconAccount,
  IconCost,
  IconMigration,
  IconApps,
  IconShield,
  IconGithub,
  IconDoc,
  IconBook,
  KIT_BASE: BASE
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/service-console/AppShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/service-console/FinOpsScreen.jsx
try { (() => {
const DS = window.UCMPDesignSystem_ec5463;
const {
  ContentLayout,
  SectionLayout,
  SubTabs,
  Select,
  Button,
  StatCard,
  Table,
  TopFiveList,
  CurrencyToggle,
  CSPIcon,
  StatusBadge,
  GuidePanel,
  Pagination,
  KeywordSearch,
  MultiSelector,
  Skeleton
} = DS;
const BASE = '../../';
const MONTHS = [{
  value: '202608',
  label: '2026년 8월'
}, {
  value: '202607',
  label: '2026년 7월'
}, {
  value: '202606',
  label: '2026년 6월'
}];
const COST_ROWS = [{
  id: 1,
  service: '통합서비스포털',
  csp: 'AWS',
  net: 182_400_000,
  saving: 18_200_000,
  share: '44.2%'
}, {
  id: 2,
  service: '모바일게이트웨이',
  csp: 'AWS',
  net: 104_100_000,
  saving: 9_800_000,
  share: '25.2%'
}, {
  id: 3,
  service: 'AI음성분석',
  csp: 'GCP',
  net: 71_300_000,
  saving: 6_100_000,
  share: '17.3%'
}, {
  id: 4,
  service: '사내데이터플랫폼',
  csp: 'AZURE',
  net: 44_050_000,
  saving: 3_400_000,
  share: '10.7%'
}, {
  id: 5,
  service: '고객상담봇',
  csp: 'AWS',
  net: 11_030_000,
  saving: 620_000,
  share: '2.6%'
}];
const won = v => '₩' + v.toLocaleString('ko-KR');

/** FinOps Overview — the product's densest analytical page. */
function FinOpsScreen({
  tab,
  onTab
}) {
  const [month, setMonth] = React.useState('202608');
  const [currency, setCurrency] = React.useState('KRW');
  const [page, setPage] = React.useState(1);
  const [q, setQ] = React.useState('');
  const [csps, setCsps] = React.useState([]);
  const selected = MONTHS.find(m => m.value === month);
  return /*#__PURE__*/React.createElement(ContentLayout, {
    title: "\uD074\uB77C\uC6B0\uB4DC \uBE44\uC6A9",
    tabs: /*#__PURE__*/React.createElement(SubTabs, {
      value: tab,
      onChange: onTab,
      items: [{
        label: 'Overview',
        value: 'finops'
      }, {
        label: '서비스별 비용',
        value: 'finops-service'
      }, {
        label: '리소스별 비용',
        value: 'finops-resource'
      }, {
        label: '크레딧 현황',
        value: 'finops-credit'
      }]
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Select, {
    value: month,
    options: MONTHS,
    onChange: setMonth,
    width: 280
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--color-text-neutral-2)'
    }
  }, "7\uC6D4 1\uC77C ~ 7\uC6D4 31\uC77C \uC0AC\uC6A9 \uBE44\uC6A9")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--color-text-neutral-2)'
    }
  }, "\uD658\uC728 1,384.20 (\uD558\uB098\uC740\uD589 \uC81C3\uC601\uC5C5\uC77C)"), /*#__PURE__*/React.createElement(CurrencyToggle, {
    value: currency,
    onChange: setCurrency
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary-outline",
    size: "sm"
  }, "\uB9AC\uD3EC\uD2B8 \uBC1C\uD589")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    label: `${selected.label} 청구비용`,
    value: "\u20A9412.8M",
    delta: "+4.2%",
    deltaTone: "up",
    footnote: "\uC804\uC6D4 \u20A9396.1M"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "\uC808\uAC10\uC561",
    value: "\u20A938.1M",
    delta: "-1.6%",
    deltaTone: "down",
    footnote: "\uD1B5\uD569\uACC4\uC57D + \uC57D\uC815 + \uD06C\uB808\uB527"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "MSP \uC81C\uC678 \uC21C\uBE44\uC6A9",
    value: "\u20A9374.7M",
    footnote: "MSP \uC218\uC218\uB8CC \uC81C\uC678"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "\uD06C\uB808\uB527 \uC794\uC561",
    value: "\u20A912.4M",
    footnote: "2026\uB144 12\uC6D4 \uB9CC\uB8CC"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(SectionLayout, {
    title: "CSP\uBCC4 \uBE44\uC6A9 \uCD94\uC774",
    description: "\uCD5C\uADFC 6\uAC1C\uC6D4 \uCCAD\uAD6C\uBE44\uC6A9\uC785\uB2C8\uB2E4."
  }, /*#__PURE__*/React.createElement(BarChart, null)), /*#__PURE__*/React.createElement(SectionLayout, {
    title: "\uC11C\uBE44\uC2A4\uBCC4 \uC0C1\uC704 5",
    description: "\uCCAD\uAD6C\uBE44\uC6A9\uC774 \uAC00\uC7A5 \uD070 \uC11C\uBE44\uC2A4\uC785\uB2C8\uB2E4."
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(TopFiveList, {
    items: COST_ROWS.map(r => ({
      label: r.service,
      value: r.net
    })),
    valueFormatter: v => '₩' + Math.round(v / 1_000_000) + 'M'
  })))), /*#__PURE__*/React.createElement(SectionLayout, {
    title: "\uC11C\uBE44\uC2A4\uBCC4 \uBE44\uC6A9",
    description: "\uC11C\uBE44\uC2A4 \uB2E8\uC704\uB85C \uCCAD\uAD6C\uBE44\uC6A9\uACFC \uC808\uAC10\uC561\uC744 \uD655\uC778\uD560 \uC218 \uC788\uC5B4\uC694."
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(KeywordSearch, {
    value: q,
    onChange: setQ,
    placeholder: "\uC11C\uBE44\uC2A4\uBA85\uC744 \uC785\uB825\uD558\uC138\uC694",
    width: 260
  }), /*#__PURE__*/React.createElement(MultiSelector, {
    label: "CSP",
    options: ['AWS', 'AZURE', 'GCP'],
    values: csps,
    onChange: setCsps
  })), /*#__PURE__*/React.createElement(Table, {
    columns: [{
      key: 'service',
      header: '서비스',
      render: r => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: 'var(--font-weight-semibold)'
        }
      }, r.service)
    }, {
      key: 'csp',
      header: 'CSP',
      width: 70,
      render: r => /*#__PURE__*/React.createElement(CSPIcon, {
        csp: r.csp,
        assetBase: BASE
      })
    }, {
      key: 'net',
      header: '청구비용',
      align: 'right',
      render: r => /*#__PURE__*/React.createElement("span", {
        style: {
          fontVariantNumeric: 'tabular-nums',
          fontWeight: 'var(--font-weight-semibold)'
        }
      }, won(r.net))
    }, {
      key: 'saving',
      header: '절감액',
      align: 'right',
      render: r => /*#__PURE__*/React.createElement("span", {
        style: {
          fontVariantNumeric: 'tabular-nums',
          color: 'var(--chart-saving)'
        }
      }, won(r.saving))
    }, {
      key: 'share',
      header: '비중',
      align: 'right',
      width: 80
    }],
    rows: COST_ROWS
  }), /*#__PURE__*/React.createElement(Pagination, {
    page: page,
    totalPages: 7,
    onChange: setPage
  }))), /*#__PURE__*/React.createElement(GuidePanel, {
    tone: "info",
    title: "\uBE44\uC6A9 \uB370\uC774\uD130 \uAE30\uC900"
  }, "\uCCAD\uAD6C\uBE44\uC6A9\uC740 \uB9E4\uC6D4 3\uC601\uC5C5\uC77C\uC5D0 \uD655\uC815\uB418\uBA70, \uD658\uC728\uC740 \uD558\uB098\uC740\uD589 \uC81C3\uC601\uC5C5\uC77C \uB9E4\uB9E4\uAE30\uC900\uC728\uC744 \uC0AC\uC6A9\uD574\uC694. MSP \uC218\uC218\uB8CC\uB294 \uBCC4\uB3C4 \uD45C\uAE30\uB429\uB2C8\uB2E4."));
}

/** Stacked bars in the pastel FinOps series colours — never brand magenta. */
function BarChart() {
  const data = [{
    m: '3월',
    aws: 148,
    azure: 42,
    gcp: 58
  }, {
    m: '4월',
    aws: 156,
    azure: 44,
    gcp: 61
  }, {
    m: '5월',
    aws: 161,
    azure: 40,
    gcp: 66
  }, {
    m: '6월',
    aws: 172,
    azure: 43,
    gcp: 68
  }, {
    m: '7월',
    aws: 168,
    azure: 45,
    gcp: 70
  }, {
    m: '8월',
    aws: 182,
    azure: 44,
    gcp: 71
  }];
  const max = 320;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: 18,
      height: 180,
      paddingBottom: 8,
      borderBottom: '1px solid var(--color-border-neutral-1)'
    }
  }, data.map(d => {
    const total = d.aws + d.azure + d.gcp;
    return /*#__PURE__*/React.createElement("div", {
      key: d.m,
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--color-text-neutral-3)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, total, "M"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        width: '100%',
        maxWidth: 46,
        height: total / max * 150,
        borderRadius: '4px 4px 0 0',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        height: `${d.gcp / total * 100}%`,
        background: 'var(--chart-gcp)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        height: `${d.azure / total * 100}%`,
        background: 'var(--chart-azure)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        height: `${d.aws / total * 100}%`,
        background: 'var(--chart-aws)'
      }
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--color-text-neutral-3)'
      }
    }, d.m));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      marginTop: 12
    }
  }, [['AWS', 'var(--chart-aws)'], ['Azure', 'var(--chart-azure)'], ['GCP', 'var(--chart-gcp)']].map(([l, c]) => /*#__PURE__*/React.createElement("span", {
    key: l,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 'var(--text-xs)',
      color: 'var(--color-black)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: 2,
      background: c
    }
  }), l))));
}
Object.assign(window, {
  FinOpsScreen,
  BarChart
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/service-console/FinOpsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/service-console/HomeScreen.jsx
try { (() => {
const DS = window.UCMPDesignSystem_ec5463;
const {
  Logo,
  CircleLoader
} = DS;
const BASE = '../../';
const SERVICES = [{
  category: 'Workspace',
  label: '서비스 대시보드',
  tone: 'var(--color-dark-blue)',
  route: 'dashboard',
  icon: /*#__PURE__*/React.createElement(IconApps, null)
}, {
  category: 'Security',
  label: '애플리케이션 보안',
  tone: 'var(--color-primary)',
  route: 'security',
  icon: /*#__PURE__*/React.createElement(IconShield, null)
}, {
  category: 'Cloud access',
  label: '클라우드 계정 / 권한',
  tone: 'var(--color-button-dark-green)',
  route: 'accounts',
  icon: /*#__PURE__*/React.createElement(IconAccount, null)
}, {
  category: 'FinOps',
  label: '클라우드 비용',
  tone: 'var(--color-status-success)',
  route: 'finops',
  icon: /*#__PURE__*/React.createElement(IconCost, null)
}, {
  category: 'AI migration',
  label: '클라우드 전환 에이전트',
  tone: 'var(--color-status-warning)',
  route: 'migration-interview',
  icon: /*#__PURE__*/React.createElement(IconMigration, null)
}, {
  category: 'Repository',
  label: 'Github 관리',
  tone: 'var(--color-neutral-700)',
  route: 'github',
  icon: /*#__PURE__*/React.createElement(IconGithub, null)
}];

/**
 * The public home surface. This is the one place UCMP uses the glass/aurora
 * treatment: translucent white cards over a magenta-and-blue radial wash with a
 * soft-light noise layer.
 */
function HomeScreen({
  authed,
  onNavigate,
  onSignIn,
  pending
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100%',
      overflow: 'hidden',
      background: 'var(--color-neutral-50)',
      color: 'var(--color-neutral-900)',
      userSelect: 'none'
    }
  }, /*#__PURE__*/React.createElement(Ambient, null), /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'relative',
      zIndex: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      width: 'min(calc(100% - 2rem), 1180px)',
      height: 58,
      minHeight: 58,
      margin: '18px auto 0',
      padding: '8px 9px 8px 14px',
      border: '1px solid var(--color-neutral-200)',
      borderRadius: 'var(--radius-glass-bar)',
      background: 'color-mix(in srgb, #fff 76%, transparent)',
      boxShadow: 'var(--shadow-glass-bar)',
      backdropFilter: 'var(--blur-glass-bar)',
      WebkitBackdropFilter: 'var(--blur-glass-bar)',
      animation: 'ucmp-rise var(--duration-enter) var(--ease-entrance) both'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: BASE + 'assets/brand/ucmp-mark.svg',
    width: "34",
    height: "34",
    alt: "",
    style: {
      filter: 'drop-shadow(0 3px 5px rgba(24,26,27,.1))'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      fontWeight: 750,
      letterSpacing: 'var(--tracking-tight)'
    }
  }, "UCMP"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 1,
      height: 18,
      background: 'rgba(72,88,111,.18)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 550,
      color: 'var(--color-neutral-500)',
      whiteSpace: 'nowrap'
    }
  }, "LG U+ Cloud Management Platform")), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 7
    }
  }, authed && /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      minHeight: 38,
      padding: '0 13px',
      border: '1px solid rgba(255,255,255,.65)',
      borderRadius: 12,
      background: 'color-mix(in srgb, var(--color-neutral-50) 78%, transparent)',
      boxShadow: '0 1px 0 rgba(255,255,255,.8) inset',
      color: 'var(--color-neutral-700)',
      fontSize: 13,
      fontWeight: 650
    }
  }, /*#__PURE__*/React.createElement(IconBook, null), /*#__PURE__*/React.createElement("span", null, "\uAC00\uC774\uB4DC")), authed ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      minHeight: 38,
      padding: '0 13px',
      borderRadius: 999,
      color: 'var(--color-neutral-700)',
      fontSize: 13,
      fontWeight: 650
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: 'var(--color-status-success)'
    }
  }), "\uAE40\uC11C\uC5F0") : /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onSignIn,
    disabled: !!pending,
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 34,
      minWidth: 68,
      padding: '0 16px',
      marginRight: 4,
      border: '1.5px solid var(--color-primary)',
      borderRadius: 999,
      background: 'transparent',
      color: 'var(--color-primary)',
      fontFamily: 'var(--font-pretendard)',
      fontSize: 13,
      fontWeight: 650,
      cursor: 'pointer'
    }
  }, pending === 'signInButton' ? /*#__PURE__*/React.createElement(CircleLoader, {
    diameter: "14px"
  }) : '로그인'))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 1,
      flex: 1,
      display: 'grid',
      gridTemplateRows: '1fr 1fr',
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      minHeight: 0,
      paddingTop: 'clamp(2rem,5vh,4rem)'
    }
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      width: 'min(calc(100% - 2rem), 1080px)',
      margin: '0 auto',
      padding: '0 0 2.2rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 810,
      margin: '0 auto',
      textAlign: 'center',
      animation: 'ucmp-rise 660ms 80ms var(--ease-entrance) both'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 'clamp(2.65rem,6.2vw,5.35rem)',
      fontWeight: 760,
      lineHeight: 1.04,
      letterSpacing: 'var(--tracking-hero)',
      textWrap: 'balance'
    }
  }, "UCMP\uC5D0\uC11C", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'transparent',
      background: 'linear-gradient(105deg, var(--color-primary) 4%, var(--color-magenta-600) 44%, var(--color-dark-blue) 100%)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text'
    }
  }, "\uD074\uB77C\uC6B0\uB4DC\uB97C \uC548\uC804\uD558\uACE0 \uC27D\uAC8C")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '26px auto 0',
      color: 'var(--color-neutral-600)',
      fontSize: 'clamp(1rem,1.55vw,1.16rem)',
      fontWeight: 470,
      lineHeight: 1.72,
      letterSpacing: '-0.015em'
    }
  }, "\uD074\uB77C\uC6B0\uB4DC \uD658\uACBD\uC744 \uC548\uC804\uD558\uAC8C \uB9CC\uB4E4\uACE0,", /*#__PURE__*/React.createElement("br", null), " \uBCF4\uC548 \uC0C1\uD0DC\uB97C \uD55C\uB208\uC5D0 \uC870\uD68C\uD558\uACE0 \uC810\uAC80\uD560 \uC218 \uC788\uC5B4\uC694."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: 9,
      marginTop: 27
    }
  }, [['통합 관리', '✓'], ['기본부터 안전하게', '⌾'], ['AI 기반 전환', '✦']].map(([t, g]) => /*#__PURE__*/React.createElement("span", {
    key: t,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '7px 11px',
      color: '#64748a',
      fontSize: 12,
      fontWeight: 620
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--color-primary)'
    }
  }, g), t))))), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 'min(calc(100% - 2rem), 1080px)',
      margin: '0 auto 19px'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 6px',
      color: 'var(--color-neutral-600)',
      fontSize: 10,
      fontWeight: 760,
      letterSpacing: '0.12em'
    }
  }, authed ? 'YOUR WORKSPACE' : 'SERVICES'), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 'clamp(1.42rem,2.5vw,1.85rem)',
      fontWeight: 720,
      lineHeight: 1.25,
      letterSpacing: '-0.035em'
    }
  }, "\uC5B4\uB5A4 \uC791\uC5C5\uC744 \uC2DC\uC791\uD560\uAE4C\uC694?"))), /*#__PURE__*/React.createElement("section", {
    style: {
      width: 'min(calc(100% - 2rem), 1080px)',
      margin: '0 auto',
      alignSelf: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
      gap: 14
    }
  }, SERVICES.map((s, i) => /*#__PURE__*/React.createElement(ServiceCard, {
    key: s.label,
    service: s,
    index: i,
    pending: pending,
    onClick: () => authed ? onNavigate(s.route) : onSignIn(s.route)
  }))))), /*#__PURE__*/React.createElement("footer", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 'min(calc(100% - 2rem), 1080px)',
      height: 45,
      margin: '0 auto',
      padding: '0 0 28px',
      color: '#8793a4',
      fontSize: 11,
      fontWeight: 540
    }
  }, /*#__PURE__*/React.createElement("span", null, "LG U+ Cloud Management Platform")));
}
function ServiceCard({
  service,
  index,
  pending,
  onClick
}) {
  const [hover, setHover] = React.useState(false);
  const dim = pending && pending !== service.route;
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    disabled: !!pending,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      width: '100%',
      padding: '16px 20px',
      overflow: 'hidden',
      textAlign: 'left',
      border: '1px solid ' + (hover ? service.tone : 'var(--color-neutral-300)'),
      borderRadius: 'var(--radius-glass)',
      background: hover ? `color-mix(in srgb, ${service.tone} 5%, #fff)` : 'color-mix(in srgb, #fff 76%, transparent)',
      boxShadow: hover ? `0 1px 0 #fff inset, 0 10px 24px color-mix(in srgb, ${service.tone} 12%, transparent)` : 'var(--shadow-glass-card)',
      backdropFilter: 'var(--blur-glass)',
      WebkitBackdropFilter: 'var(--blur-glass)',
      transform: hover ? 'translateY(-2px)' : 'none',
      transition: 'transform var(--duration-slow) var(--ease-spring), border-color var(--duration-fast) var(--ease-standard), background-color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-slow) var(--ease-standard)',
      animation: `ucmp-card-in 540ms ${160 + index * 60}ms var(--ease-entrance) both`,
      opacity: dim ? 0.55 : 1,
      cursor: pending ? 'progress' : 'pointer',
      font: 'inherit',
      color: 'inherit'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'grid',
      placeItems: 'center',
      width: 40,
      height: 40,
      flexShrink: 0,
      border: '1px solid rgba(255,255,255,.78)',
      borderRadius: 12,
      color: service.tone,
      background: `color-mix(in srgb, ${service.tone} 11%, rgba(255,255,255,.82))`,
      boxShadow: `0 5px 13px color-mix(in srgb, ${service.tone} 16%, transparent), 0 1px 0 #fff inset`
    }
  }, service.icon), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--color-neutral-600)',
      fontSize: 10,
      fontWeight: 780,
      letterSpacing: '0.09em',
      textTransform: 'uppercase'
    }
  }, service.category), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      fontWeight: 700,
      letterSpacing: 'var(--tracking-tight)'
    }
  }, service.label)), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'grid',
      placeItems: 'center',
      width: 34,
      height: 34,
      flexShrink: 0,
      marginLeft: 'auto',
      borderRadius: '50%',
      color: hover ? '#fff' : '#8290a2',
      background: hover ? service.tone : 'rgba(255,255,255,.65)',
      transform: hover ? 'translate(2px,-2px)' : 'none',
      transition: 'all 220ms var(--ease-standard)'
    }
  }, pending === service.route ? /*#__PURE__*/React.createElement(CircleLoader, {
    diameter: "16px",
    borderColor: service.tone
  }) : '↗'));
}
function Ambient() {
  return /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      background: 'radial-gradient(circle at 50% -10%, #fff, transparent 42%), linear-gradient(145deg, #fff 0%, var(--color-neutral-50) 52%, var(--color-neutral-100) 100%)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '-18rem',
      right: '-9rem',
      width: '48rem',
      height: '48rem',
      borderRadius: 999,
      filter: 'blur(2px)',
      opacity: 0.72,
      background: 'radial-gradient(circle at 35% 38%, color-mix(in srgb, var(--color-primary) 26%, white), var(--color-magenta-50) 48%, transparent 70%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '22rem',
      left: '-20rem',
      width: '48rem',
      height: '48rem',
      borderRadius: 999,
      filter: 'blur(2px)',
      opacity: 0.72,
      background: 'radial-gradient(circle, color-mix(in srgb, var(--color-low) 38%, white), color-mix(in srgb, var(--color-low) 14%, var(--color-neutral-50)) 48%, transparent 70%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: '8%',
      bottom: '-28rem',
      width: '44rem',
      height: '44rem',
      borderRadius: 999,
      filter: 'blur(2px)',
      opacity: 0.72,
      background: 'radial-gradient(circle, color-mix(in srgb, var(--color-primary) 12%, white), color-mix(in srgb, var(--color-low) 10%, var(--color-neutral-50)) 50%, transparent 72%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      opacity: 0.18,
      mixBlendMode: 'soft-light',
      backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.16'/%3E%3C/svg%3E\")"
    }
  }));
}

/** Okta hand-off screen. UCMP has no password form of its own. */
function SignInScreen({
  onComplete
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'grid',
      placeItems: 'center',
      minHeight: '100%',
      overflow: 'hidden',
      background: 'var(--color-neutral-50)'
    }
  }, /*#__PURE__*/React.createElement(Ambient, null), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 20,
      width: 'min(420px, calc(100% - 32px))',
      padding: 32,
      border: '1px solid var(--color-neutral-200)',
      borderRadius: 'var(--radius-glass)',
      background: 'color-mix(in srgb, #fff 88%, transparent)',
      boxShadow: 'var(--shadow-glass-popover)',
      backdropFilter: 'var(--blur-glass)',
      WebkitBackdropFilter: 'var(--blur-glass)',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    size: "large",
    assetBase: BASE
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 20,
      fontWeight: 720,
      letterSpacing: '-0.03em'
    }
  }, "\uC0AC\uB0B4 \uACC4\uC815\uC73C\uB85C \uB85C\uADF8\uC778\uD574\uC8FC\uC138\uC694"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '8px 0 0',
      fontSize: 13,
      lineHeight: 1.7,
      color: 'var(--color-neutral-600)'
    }
  }, "UCMP\uB294 Okta \uACC4\uC815\uC73C\uB85C\uB9CC \uC811\uC18D\uD560 \uC218 \uC788\uC5B4\uC694.", /*#__PURE__*/React.createElement("br", null), "\uAD8C\uD55C\uC774 \uD544\uC694\uD558\uBA74 UCMP \uAD00\uB9AC\uC790\uC5D0\uAC8C \uBB38\uC758\uD574\uC8FC\uC138\uC694.")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onComplete,
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      width: '100%',
      height: 44,
      border: 0,
      borderRadius: 999,
      background: 'var(--color-primary)',
      color: '#fff',
      fontFamily: 'var(--font-pretendard)',
      fontSize: 14,
      fontWeight: 650,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: BASE + 'assets/okta.png',
    alt: "",
    height: "16",
    style: {
      objectFit: 'contain',
      filter: 'brightness(0) invert(1)'
    }
  }), "Okta\uB85C \uB85C\uADF8\uC778"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: '#8793a4'
    }
  }, "LG U+ Cloud Management Platform")));
}
Object.assign(window, {
  HomeScreen,
  SignInScreen,
  Ambient
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/service-console/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/service-console/RequestFormScreen.jsx
try { (() => {
const DS = window.UCMPDesignSystem_ec5463;
const {
  ContentLayout,
  FormGroup,
  FormField,
  Input,
  Select,
  Checkbox,
  Button,
  GuidePanel,
  Toast,
  Breadcrumbs,
  CSPIcon
} = DS;
const BASE = '../../';

/** Request form template — the RequestForm layout at 1024px with validation. */
function RequestFormScreen({
  onDone
}) {
  const [name, setName] = React.useState('ucmp-!!');
  const [csp, setCsp] = React.useState('AWS');
  const [env, setEnv] = React.useState('prod');
  const [team, setTeam] = React.useState('클라우드기술팀');
  const [reason, setReason] = React.useState('');
  const [agree, setAgree] = React.useState(false);
  const [toast, setToast] = React.useState(false);
  const nameError = /^[a-z0-9-]+$/.test(name) ? null : '영문 소문자, 숫자, 하이픈만 사용할 수 있어요.';
  const reasonError = reason.trim() ? null : null;
  function submit() {
    setToast(true);
    setTimeout(() => {
      setToast(false);
      onDone && onDone();
    }, 1800);
  }
  return /*#__PURE__*/React.createElement(ContentLayout, null, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--form-max-width)',
      margin: '0 auto',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      paddingTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Breadcrumbs, {
    items: [{
      label: '클라우드'
    }, {
      label: '서비스 / 계정'
    }, {
      label: '계정 생성 요청'
    }]
  }), /*#__PURE__*/React.createElement("h1", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      margin: 0,
      fontSize: 'var(--text-xl)',
      lineHeight: 'var(--leading-xl)',
      fontWeight: 'var(--font-weight-bold)'
    }
  }, /*#__PURE__*/React.createElement(CSPIcon, {
    csp: csp,
    assetBase: BASE
  }), "\uACC4\uC815 \uC0DD\uC131 \uC694\uCCAD")), /*#__PURE__*/React.createElement(GuidePanel, {
    tone: "info",
    title: "\uC694\uCCAD \uC804 \uD655\uC778\uD574\uC8FC\uC138\uC694"
  }, "\uACC4\uC815 \uC0DD\uC131\uC740 \uC2B9\uC778 \uD6C4 \uC601\uC5C5\uC77C \uAE30\uC900 1\uC77C \uC774\uB0B4\uC5D0 \uC644\uB8CC\uB3FC\uC694. \uC0DD\uC131 \uD6C4\uC5D0\uB294 CSP\uC640 \uD658\uACBD\uC744 \uBCC0\uACBD\uD560 \uC218 \uC5C6\uC5B4\uC694."), /*#__PURE__*/React.createElement(FormGroup, {
    title: "\uAE30\uBCF8 \uC815\uBCF4"
  }, /*#__PURE__*/React.createElement(FormField, {
    label: "\uC11C\uBE44\uC2A4\uBA85",
    required: true,
    error: nameError
  }, /*#__PURE__*/React.createElement(Input, {
    value: name,
    status: nameError ? 'error' : 'default',
    onChange: e => setName(e.target.value)
  })), /*#__PURE__*/React.createElement(FormField, {
    label: "CSP",
    required: true,
    hint: "\uC0DD\uC131 \uD6C4\uC5D0\uB294 \uBCC0\uACBD\uD560 \uC218 \uC5C6\uC5B4\uC694."
  }, /*#__PURE__*/React.createElement(Select, {
    value: csp,
    options: ['AWS', 'AZURE', 'GCP'],
    onChange: setCsp,
    width: 220
  })), /*#__PURE__*/React.createElement(FormField, {
    label: "\uC6B4\uC601 \uD658\uACBD",
    required: true
  }, /*#__PURE__*/React.createElement(Select, {
    value: env,
    options: ['prod', 'stg', 'dev'],
    onChange: setEnv,
    width: 220
  })), /*#__PURE__*/React.createElement(FormField, {
    label: "\uB2F4\uB2F9 \uC870\uC9C1",
    required: true
  }, /*#__PURE__*/React.createElement(Select, {
    value: team,
    options: ['클라우드기술팀', '모바일플랫폼팀', 'AI기술팀', '데이터플랫폼팀'],
    onChange: setTeam,
    width: 280
  }))), /*#__PURE__*/React.createElement(FormGroup, {
    title: "\uC694\uCCAD \uC0AC\uC720"
  }, /*#__PURE__*/React.createElement(FormField, {
    label: "\uC0AC\uC720",
    required: true,
    error: reasonError
  }, /*#__PURE__*/React.createElement("textarea", {
    value: reason,
    onChange: e => setReason(e.target.value),
    rows: 4,
    placeholder: "\uACC4\uC815\uC774 \uD544\uC694\uD55C \uC774\uC720\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694.",
    style: {
      width: '100%',
      padding: 8,
      borderRadius: 'var(--radius-control)',
      border: '1px solid var(--color-border-neutral-2)',
      fontFamily: 'var(--font-pretendard)',
      fontSize: 'var(--text-sm)',
      lineHeight: 'var(--leading-relaxed)',
      resize: 'vertical',
      outline: 'none'
    }
  })), /*#__PURE__*/React.createElement(FormField, {
    label: "\uBCF4\uC548 \uC815\uCC45"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    checked: agree,
    onChange: setAgree,
    label: "UCMP \uD074\uB77C\uC6B0\uB4DC \uBCF4\uC548 \uC815\uCC45\uC744 \uD655\uC778\uD588\uC2B5\uB2C8\uB2E4."
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary-outline",
    onClick: onDone
  }, "\uCDE8\uC18C"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary-solid",
    disabled: !!nameError || !agree || !reason.trim(),
    onClick: submit
  }, "\uC694\uCCAD"))), toast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      bottom: 32,
      left: 0,
      right: 0,
      display: 'grid',
      placeItems: 'center',
      zIndex: 60
    }
  }, /*#__PURE__*/React.createElement(Toast, {
    tone: "success"
  }, "\uACC4\uC815 \uC0DD\uC131\uC774 \uC694\uCCAD\uB418\uC5C8\uC2B5\uB2C8\uB2E4.")));
}
Object.assign(window, {
  RequestFormScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/service-console/RequestFormScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/service-console/SecurityScreen.jsx
try { (() => {
const DS = window.UCMPDesignSystem_ec5463;
const {
  ContentLayout,
  SectionLayout,
  SubTabs,
  StatCard,
  GaugeChart,
  Table,
  TopFiveList,
  Button,
  StatusBadge,
  Tag,
  GuidePanel,
  Select
} = DS;
const BASE = '../../';
const REPOS = [{
  id: 1,
  repo: 'ucmp-service-portal',
  grade: 'A',
  critical: 0,
  high: 2,
  medium: 11,
  rate: 96,
  tone: 'success',
  s: '조치 완료'
}, {
  id: 2,
  repo: 'ucmp-mobile-gateway',
  grade: 'B',
  critical: 1,
  high: 6,
  medium: 18,
  rate: 74,
  tone: 'progress',
  s: '조치 중'
}, {
  id: 3,
  repo: 'ucmp-ai-voice',
  grade: 'C',
  critical: 4,
  high: 12,
  medium: 27,
  rate: 41,
  tone: 'error',
  s: '조치 필요'
}, {
  id: 4,
  repo: 'ucmp-data-platform',
  grade: 'B',
  critical: 0,
  high: 4,
  medium: 22,
  rate: 81,
  tone: 'progress',
  s: '조치 중'
}];
const GRADE_TONE = {
  A: 'var(--color-status-success)',
  B: 'var(--color-low)',
  C: 'var(--color-status-warning)',
  D: 'var(--color-status-error)'
};

/** 애플리케이션 보안 — grade distribution, remediation rate, per-repo table. */
function SecurityScreen({
  tab,
  onTab
}) {
  const [scope, setScope] = React.useState('전체 조직');
  return /*#__PURE__*/React.createElement(ContentLayout, {
    title: "\uC560\uD50C\uB9AC\uCF00\uC774\uC158 \uBCF4\uC548",
    tabs: /*#__PURE__*/React.createElement(SubTabs, {
      value: tab,
      onChange: onTab,
      items: [{
        label: 'Overview',
        value: 'security'
      }, {
        label: '저장소',
        value: 'security-repo',
        count: REPOS.length
      }, {
        label: '리포트',
        value: 'security-report'
      }]
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Select, {
    value: scope,
    options: ['전체 조직', '클라우드기술팀', 'AI기술팀'],
    onChange: setScope,
    width: 200
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary-outline",
    size: "sm"
  }, "\uBCF4\uC548 \uB9AC\uD3EC\uD2B8 \uBC1C\uD589"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    label: "\uC810\uAC80 \uB300\uC0C1 \uC800\uC7A5\uC18C",
    value: "48",
    unit: "\uAC1C",
    footnote: "\uCD5C\uADFC \uC2A4\uCE94 2026-09-01"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Critical \uCDE8\uC57D\uC810",
    value: "5",
    unit: "\uAC74",
    delta: "-3",
    deltaTone: "down",
    footnote: "\uC804\uC8FC 8\uAC74"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Secret \uB178\uCD9C",
    value: "2",
    unit: "\uAC74",
    delta: "+1",
    deltaTone: "up",
    footnote: "\uC989\uC2DC \uC870\uCE58 \uD544\uC694"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "\uD3C9\uADE0 \uC870\uCE58 \uC18C\uC694",
    value: "4.2",
    unit: "\uC77C",
    footnote: "\uBAA9\uD45C 5\uC77C \uC774\uB0B4"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1.2fr',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(SectionLayout, {
    title: "\uCDE8\uC57D\uC810 \uC870\uCE58\uC728",
    description: "\uC870\uCE58 \uC644\uB8CC \uBE44\uC728\uC785\uB2C8\uB2E4."
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      placeItems: 'center',
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement(GaugeChart, {
    value: 73,
    label: "\uC870\uCE58\uC728",
    size: 132
  }))), /*#__PURE__*/React.createElement(SectionLayout, {
    title: "\uBCF4\uC548 \uB4F1\uAE09 \uBD84\uD3EC",
    description: "\uC800\uC7A5\uC18C \uB4F1\uAE09\uBCC4 \uAC1C\uC218\uC785\uB2C8\uB2E4."
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      marginTop: 20
    }
  }, [['A', 21], ['B', 18], ['C', 7], ['D', 2]].map(([g, n]) => /*#__PURE__*/React.createElement("div", {
    key: g,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'grid',
      placeItems: 'center',
      width: 22,
      height: 22,
      borderRadius: 'var(--radius-xs)',
      background: GRADE_TONE[g],
      color: '#fff',
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--font-weight-bold)'
    }
  }, g), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: 8,
      borderRadius: 'var(--radius-full)',
      background: 'var(--color-bg-neutral-2)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      height: 8,
      width: `${n / 21 * 100}%`,
      borderRadius: 'var(--radius-full)',
      background: GRADE_TONE[g]
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 34,
      textAlign: 'right',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--font-weight-semibold)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, n, "\uAC1C"))))), /*#__PURE__*/React.createElement(SectionLayout, {
    title: "\uCDE8\uC57D\uC810 \uC0C1\uC704 \uC800\uC7A5\uC18C",
    description: "Critical + High \uAC74\uC218 \uAE30\uC900\uC785\uB2C8\uB2E4."
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement(TopFiveList, {
    color: "var(--color-critical)",
    items: REPOS.map(r => ({
      label: r.repo,
      value: r.critical * 3 + r.high
    })).sort((a, b) => b.value - a.value),
    valueFormatter: v => v + '건'
  })))), /*#__PURE__*/React.createElement(SectionLayout, {
    title: "\uC800\uC7A5\uC18C\uBCC4 \uC810\uAC80 \uACB0\uACFC",
    description: "GitHub \uC800\uC7A5\uC18C \uB2E8\uC704\uC758 \uBCF4\uC548 \uC810\uAC80 \uACB0\uACFC\uC785\uB2C8\uB2E4."
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(Table, {
    columns: [{
      key: 'repo',
      header: '저장소',
      render: r => /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }
      }, /*#__PURE__*/React.createElement("img", {
        src: BASE + 'assets/infra/GITHUB-LOGO.webp',
        width: "16",
        height: "16",
        alt: "",
        style: {
          objectFit: 'contain'
        }
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: 'var(--font-weight-semibold)'
        }
      }, r.repo))
    }, {
      key: 'grade',
      header: '등급',
      width: 70,
      render: r => /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'grid',
          placeItems: 'center',
          width: 22,
          height: 22,
          borderRadius: 'var(--radius-xs)',
          background: GRADE_TONE[r.grade],
          color: '#fff',
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--font-weight-bold)'
        }
      }, r.grade)
    }, {
      key: 'critical',
      header: 'Critical',
      align: 'right',
      width: 80,
      render: r => /*#__PURE__*/React.createElement("span", {
        style: {
          fontVariantNumeric: 'tabular-nums',
          color: r.critical ? 'var(--color-status-error)' : 'var(--color-text-neutral-2)',
          fontWeight: r.critical ? 'var(--font-weight-semibold)' : 400
        }
      }, r.critical)
    }, {
      key: 'high',
      header: 'High',
      align: 'right',
      width: 70,
      render: r => /*#__PURE__*/React.createElement("span", {
        style: {
          fontVariantNumeric: 'tabular-nums'
        }
      }, r.high)
    }, {
      key: 'medium',
      header: 'Medium',
      align: 'right',
      width: 80,
      render: r => /*#__PURE__*/React.createElement("span", {
        style: {
          fontVariantNumeric: 'tabular-nums',
          color: 'var(--color-text-neutral-3)'
        }
      }, r.medium)
    }, {
      key: 'rate',
      header: '조치율',
      align: 'right',
      width: 90,
      render: r => /*#__PURE__*/React.createElement("span", {
        style: {
          fontVariantNumeric: 'tabular-nums',
          fontWeight: 'var(--font-weight-semibold)'
        }
      }, r.rate, "%")
    }, {
      key: 's',
      header: '상태',
      width: 104,
      render: r => /*#__PURE__*/React.createElement(StatusBadge, {
        tone: r.tone
      }, r.s)
    }],
    rows: REPOS
  }))), /*#__PURE__*/React.createElement(GuidePanel, {
    tone: "info",
    title: "\uC810\uAC80 \uC8FC\uAE30"
  }, "\uC800\uC7A5\uC18C \uBCF4\uC548 \uC810\uAC80\uC740 \uB9E4\uC77C \uC0C8\uBCBD \uC790\uB3D9\uC73C\uB85C \uC218\uD589\uB3FC\uC694. \uBC1C\uD589\uD55C \uBCF4\uC548 \uB9AC\uD3EC\uD2B8\uB294 \uC18C\uC2A4 \uBCF4\uC548 \uC810\uAC80 \uACB0\uACFC\uB85C \uD65C\uC6A9\uD560 \uC218 \uC788\uC5B4\uC694."));
}
Object.assign(window, {
  SecurityScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/service-console/SecurityScreen.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.CSPIcon = __ds_scope.CSPIcon;

__ds_ns.CSPChip = __ds_scope.CSPChip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.CircleLoader = __ds_scope.CircleLoader;

__ds_ns.Skeleton = __ds_scope.Skeleton;

__ds_ns.ExternalLinkButton = __ds_scope.ExternalLinkButton;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.StatusBadge = __ds_scope.StatusBadge;

__ds_ns.CountBadge = __ds_scope.CountBadge;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.TabCount = __ds_scope.TabCount;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.ToggleSwitch = __ds_scope.ToggleSwitch;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.DetailListItem = __ds_scope.DetailListItem;

__ds_ns.ErrorNotice = __ds_scope.ErrorNotice;

__ds_ns.GaugeChart = __ds_scope.GaugeChart;

__ds_ns.GuidePanel = __ds_scope.GuidePanel;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.Table = __ds_scope.Table;

__ds_ns.TopFiveList = __ds_scope.TopFiveList;

__ds_ns.UserInfoCard = __ds_scope.UserInfoCard;

__ds_ns.CurrencyToggle = __ds_scope.CurrencyToggle;

__ds_ns.DateRangePicker = __ds_scope.DateRangePicker;

__ds_ns.FormField = __ds_scope.FormField;

__ds_ns.FormGroup = __ds_scope.FormGroup;

__ds_ns.KeywordSearch = __ds_scope.KeywordSearch;

__ds_ns.MultiSelector = __ds_scope.MultiSelector;

__ds_ns.Breadcrumbs = __ds_scope.Breadcrumbs;

__ds_ns.ContentLayout = __ds_scope.ContentLayout;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Pagination = __ds_scope.Pagination;

__ds_ns.SectionLayout = __ds_scope.SectionLayout;

__ds_ns.SidePanel = __ds_scope.SidePanel;

__ds_ns.SidebarNav = __ds_scope.SidebarNav;

__ds_ns.SubTabs = __ds_scope.SubTabs;

})();
