import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

export type CustomPickerItem = {
  label: string;
  value: string;
  helperText?: string;
};

export type CustomPickerProps = {
  items: CustomPickerItem[];
  selectedValue?: string | null;
  onValueChange: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
};

export const CustomPicker: React.FC<CustomPickerProps> = ({
  items,
  selectedValue,
  onValueChange,
  placeholder = "Selecione",
  emptyMessage = "Nenhuma opção disponível",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<
    { top: number; left: number; width: number } | null
  >(null);
  const triggerRef = useRef<View>(null);

  const selectedItem = useMemo(
    () => items.find((item) => item.value === selectedValue) || null,
    [items, selectedValue]
  );

  const buttonLabel = selectedItem?.label ?? placeholder;
  const isPlaceholder = !selectedItem;
  const hasItems = items.length > 0;

  const closePicker = () => {
    setIsOpen(false);
    setDropdownPosition(null);
  };

  const togglePicker = () => {
    if (disabled || !hasItems) {
      return;
    }

    if (!isOpen) {
      triggerRef.current?.measureInWindow((x, y, width, height) => {
        const window = Dimensions.get("window");
        const windowWidth = window.width;
        const verticalGap = 8;

        let top = y + height + verticalGap;

        let left = x;
        const horizontalPadding = 16;
        if (left + width > windowWidth - horizontalPadding) {
          left = windowWidth - width - horizontalPadding;
        }
        left = Math.max(horizontalPadding, left);

        setDropdownPosition({
          top,
          left,
          width,
        });
        setIsOpen(true);
      });
    } else {
      closePicker();
    }
  };

  const handleSelect = (value: string) => {
    onValueChange(value);
    closePicker();
  };

  return (
    <>
      <TouchableOpacity
        ref={triggerRef}
        activeOpacity={0.8}
        disabled={disabled || !hasItems}
        onPress={togglePicker}
        className={`w-full bg-secondary/5 border-2 border-secondary/10 rounded-2xl px-4 py-3 flex-row items-center justify-between ${
          disabled || !hasItems ? "opacity-60" : ""
        }`}
      >
        <Text
          className={`font-rregular text-base ${
            isPlaceholder ? "text-secondary/50" : "text-secondary"
          }`}
          numberOfLines={1}
        >
          {buttonLabel}
        </Text>
        <FontAwesome6
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={16}
          color="#D5D962"
        />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={closePicker}
      >
        <Pressable
          style={{ flex: 1 }}
          onPress={closePicker}
          className="bg-black/40"
        >
          {dropdownPosition && (
            <View
              style={{
                position: "absolute",
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: dropdownPosition.width,
              }}
              className="bg-white rounded-2xl border-2 border-secondary/10 shadow-xl overflow-hidden"
            >
              {hasItems ? (
                <ScrollView
                  style={{ maxHeight: 260 }}
                  showsVerticalScrollIndicator={false}
                >
                  {items.map((item) => {
                    const isSelected = item.value === selectedItem?.value;
                    return (
                      <TouchableOpacity
                        key={item.value}
                        activeOpacity={0.7}
                        onPress={() => handleSelect(item.value)}
                        className={`px-4 py-3 border-b border-secondary/10 ${
                          isSelected ? "bg-darkgreen/10" : "bg-white"
                        }`}
                      >
                        <Text
                          className={`font-rsemi text-base ${
                            isSelected ? "text-darkgreen" : "text-secondary"
                          }`}
                        >
                          {item.label}
                        </Text>
                        {item.helperText ? (
                          <Text className="font-rregular text-xs text-secondary/60 mt-1">
                            {item.helperText}
                          </Text>
                        ) : null}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              ) : (
                <View className="px-4 py-6 items-center justify-center">
                  <Text className="font-rregular text-sm text-secondary/60 text-center">
                    {emptyMessage}
                  </Text>
                </View>
              )}
            </View>
          )}
        </Pressable>
      </Modal>
    </>
  );
};

export default CustomPicker;
