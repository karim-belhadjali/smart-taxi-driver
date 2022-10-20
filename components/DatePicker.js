import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import AntDesign from "react-native-vector-icons/AntDesign";

import tw from "twrnc";
const DatePicker = ({ onSelect }) => {
  const [date, setDate] = useState(new Date(Date.now()));
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
    onSelect(currentDate);
  };

  return (
    <>
      <Text style={[tw`mx-1`, styles.text]}>Date de naissance</Text>
      <TouchableOpacity
        style={tw`flex flex-row border border-[#979797] w-[80%] h-10 items-center justify-center rounded-lg px-4`}
        onPress={() => setShow(true)}
      >
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            onChange={onChange}
          />
        )}
        <Text style={tw`flex-1`}>{date.toDateString()}</Text>
        <AntDesign name="calendar" size={20} color="#431879" />
      </TouchableOpacity>
    </>
  );
};

export default DatePicker;

const styles = StyleSheet.create({
  text: {
    fontFamily: "Poppins-Light",
    lineHeight: 21,
  },
});
