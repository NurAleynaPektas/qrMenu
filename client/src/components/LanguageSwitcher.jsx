import * as Select from "@radix-ui/react-select";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import s from "./LanguageSwitcher.module.css"; // ufak stiller (aşağıda)

const LANGS = [
  { code: "tr", label: "TR" },
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
];

export default function LanguageSwitcher({ compact = false }) {
  const { i18n, t } = useTranslation();
  const [lng, setLng] = useState(i18n.language || "tr");

  useEffect(() => {
    if (lng && lng !== i18n.language) {
      i18n.changeLanguage(lng);
    }
  }, [lng, i18n]);

  return (
    <Select.Root value={lng} onValueChange={setLng}>
      <Select.Trigger
        className={compact ? s.triggerSm : s.trigger}
        aria-label="Language"
      >
        <Select.Value placeholder={t(`nav.lang_${lng}`)} />
        <Select.Icon className={s.icon}>▾</Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className={s.content} position="popper" sideOffset={6}>
          <Select.Viewport className={s.viewport}>
            {LANGS.map((l) => (
              <Select.Item key={l.code} value={l.code} className={s.item}>
                <Select.ItemText>{l.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
