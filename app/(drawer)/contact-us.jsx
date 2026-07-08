// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   Linking,
//   Alert,
//   ActivityIndicator
// } from 'react-native';
// import { Feather, Ionicons } from '@expo/vector-icons';

// export default function ContactUsScreen() {
//   // Form States
//   const [name, setName] = useState('Usman Adams');
//   const [email, setEmail] = useState('usmanadams551@gmail.com');
//   const [phone, setPhone] = useState('09018827571');
//   const [message, setMessage] = useState('');
//   const [isSending, setIsSending] = useState(false);

//   const handleSendMessage = () => {
//     if (!name.trim() || !email.trim() || !message.trim()) {
//       Alert.alert("Missing Fields", "Please fill in your name, email, and message.");
//       return;
//     }
    
//     setIsSending(true);
//     // Simulating API message dispatch
//     setTimeout(() => {
//       setIsSending(false);
//       setMessage('');
//       Alert.alert("Message Sent", "Thank you! Our representative will get back to you shortly.");
//     }, 1500);
//   };

//   const openWhatsApp = (phoneNumber: string) => {
//     Linking.openURL(`whatsapp://send?phone=${phoneNumber.replace(/\s+/g, '')}`);
//   };

//   const openDialer = (phoneNumber: string) => {
//     Linking.openURL(`tel:${phoneNumber.replace(/\s+/g, '')}`);
//   };

//   const openMaps = () => {
//     Linking.openURL('https://www.google.com/maps/place/Maitangaran+Textiles+Limited+Abuja/@9.0805177,7.4727197,17s/');
//   };

//   return (
//     <ScrollView 
//       className="flex-1 bg-slate-50/50" 
//       showsVerticalScrollIndicator={false} 
//       contentContainerStyle={{ padding: 20 }}
//     >
//       {/* INTRO HERO */}
//       <View className="mt-2 mb-6">
//         <Text className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Get In Touch</Text>
//         <Text className="text-3xl font-black tracking-tighter text-slate-900 mt-1 leading-9">
//           Send Us a Message
//         </Text>
//         <Text className="text-sm text-slate-500 font-normal mt-3 leading-6">
//           For wholesale or retail inquiries, nationwide delivery, or premium fabric stock questions, please complete the sheet below or talk directly to our desk.
//         </Text>
//       </View>

//       {/* INTERACTIVE FORM CONTAINER */}
//       <View 
//         className="bg-white border border-slate-100 rounded-2xl p-5 mb-6"
//         style={{ elevation: 2, shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }}
//       >
//         <Text className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-4">Inquiry Form</Text>
        
//         {/* Name Input */}
//         <View className="mb-4">
//           <Text className="text-[11px] font-semibold text-slate-500 mb-1.5 pl-1">Full Name</Text>
//           <TextInput
//             value={name}
//             onChangeText={setName}
//             placeholder="Your name"
//             placeholderTextColor="#94a3b8"
//             className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-slate-800 text-xs font-medium"
//           />
//         </View>

//         {/* Email Input */}
//         <View className="mb-4">
//           <Text className="text-[11px] font-semibold text-slate-500 mb-1.5 pl-1">Email Address</Text>
//           <TextInput
//             value={email}
//             onChangeText={setEmail}
//             keyboardType="email-address"
//             autoCapitalize="none"
//             placeholder="yourname@domain.com"
//             placeholderTextColor="#94a3b8"
//             className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-slate-800 text-xs font-medium"
//           />
//         </View>

//         {/* Phone Input */}
//         <View className="mb-4">
//           <Text className="text-[11px] font-semibold text-slate-500 mb-1.5 pl-1">Phone Number</Text>
//           <TextInput
//             value={phone}
//             onChangeText={setPhone}
//             keyboardType="phone-pad"
//             placeholder="09000000000"
//             placeholderTextColor="#94a3b8"
//             className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-slate-800 text-xs font-medium"
//           />
//         </View>

//         {/* Message Input */}
//         <View className="mb-5">
//           <Text className="text-[11px] font-semibold text-slate-500 mb-1.5 pl-1">Your Message</Text>
//           <TextInput
//             value={message}
//             onChangeText={setMessage}
//             multiline
//             numberOfLines={4}
//             placeholder="Write details about your premium order rules, quantities, or styles here..."
//             placeholderTextColor="#94a3b8"
//             className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-slate-800 text-xs font-medium min-h-[90px]"
//             textAlignVertical="top"
//           />
//         </View>

//         {/* Submit Button */}
//         <TouchableOpacity
//           onPress={handleSendMessage}
//           disabled={isSending}
//           className="w-full bg-slate-900 py-3.5 rounded-xl items-center justify-center active:opacity-95"
//         >
//           {isSending ? (
//             <ActivityIndicator size="small" color="#ffffff" />
//           ) : (
//             <Text className="text-white text-xs font-bold uppercase tracking-wider">Dispatch Message</Text>
//           )}
//         </TouchableOpacity>
//       </View>

//       {/* OPERATIONS TIMES */}
//       <View 
//         className="bg-white border border-slate-100 rounded-2xl p-4 mb-6 flex-row items-center justify-between"
//         style={{ elevation: 2, shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }}
//       >
//         <View className="flex-row items-center flex-1 pr-2">
//           <Feather name="clock" size={16} color="#64748b" />
//           <View className="ml-3">
//             <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Showroom Hours</Text>
//             <Text className="text-xs font-bold text-slate-800 mt-0.5">Mon - Sat: 9:00 AM – 6:00 PM</Text>
//           </View>
//         </View>
//         <View className="bg-red-50 px-2.5 py-1 rounded-full">
//           <Text className="text-[10px] font-bold text-red-500 uppercase">Sun Closed</Text>
//         </View>
//       </View>

//       {/* LOGISTICS & SHOWROOM LAYOUTS */}
//       <View className="mb-6">
//         <Text className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-3">Our Operations Layout</Text>

//         {/* Kano HQ */}
//         <View 
//           className="bg-white border border-slate-100 rounded-2xl p-4 mb-3"
//           style={{ elevation: 2, shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }}
//         >
//           <View className="flex-row justify-between items-center mb-2">
//             <Text className="text-sm font-bold text-slate-900">Kano Head Office</Text>
//             <View className="bg-slate-100 px-2 py-0.5 rounded-full">
//               <Text className="text-[9px] font-bold text-slate-700 uppercase tracking-wide">HQ</Text>
//             </View>
//           </View>
//           <Text className="text-xs text-slate-500 leading-5">
//             4 Fagge Ta Kudu, A.A. Maitangaran House, Opposite Kwari Market, Kano State.
//           </Text>
//         </View>

//         {/* Abuja Branch */}
//         <TouchableOpacity 
//           onPress={openMaps}
//           className="bg-white border border-slate-100 rounded-2xl p-4 active:bg-slate-50"
//           style={{ elevation: 2, shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }}
//         >
//           <View className="flex-row justify-between items-center mb-2">
//             <Text className="text-sm font-bold text-slate-900">Abuja Showroom</Text>
//             <Feather name="map-pin" size={14} color="#3b82f6" />
//           </View>
//           <Text className="text-xs text-slate-500 leading-5 pr-4">
//             Plot 1723, Suite 19, Nürnberger Plaza, Beside Rockview Hotel, Adetokunbo Ademola Crescent, Wuse II, Abuja.
//           </Text>
//           <Text className="text-[11px] text-blue-500 font-semibold mt-2.5">Open in Google Maps →</Text>
//         </TouchableOpacity>
//       </View>

//       {/* DIRECT CONNECT TRAYS */}
//       <View className="mb-8">
//         <Text className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-3">Direct Connect Hub</Text>
        
//         <View 
//           className="border border-slate-100 rounded-2xl overflow-hidden bg-white"
//           style={{ elevation: 2, shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }}
//         >
//           <TouchableOpacity onPress={() => openDialer('+2348032838463')} className="flex-row items-center justify-between p-4 border-b border-slate-50 active:bg-slate-50">
//             <View className="flex-row items-center">
//               <Feather name="phone" size={16} color="#64748b" />
//               <Text className="text-xs font-semibold text-slate-700 ml-3">Call Kano HQ</Text>
//             </View>
//             <Text className="text-xs text-slate-400 font-mono">+234 803 283 8463</Text>
//           </TouchableOpacity>

//           <TouchableOpacity onPress={() => openWhatsApp('+2348032959574')} className="flex-row items-center justify-between p-4 border-b border-slate-50 active:bg-slate-50">
//             <View className="flex-row items-center">
//               <Ionicons name="logo-whatsapp" size={16} color="#16a34a" />
//               <Text className="text-xs font-semibold text-slate-700 ml-3">WhatsApp Kano</Text>
//             </View>
//             <Text className="text-xs text-emerald-600 font-medium">Chat Online</Text>
//           </TouchableOpacity>

//           <TouchableOpacity onPress={() => openWhatsApp('+2348065498720')} className="flex-row items-center justify-between p-4 border-b border-slate-50 active:bg-slate-50">
//             <View className="flex-row items-center">
//               <Ionicons name="logo-whatsapp" size={16} color="#16a34a" />
//               <Text className="text-xs font-semibold text-slate-700 ml-3">WhatsApp Abuja</Text>
//             </View>
//             <Text className="text-xs text-emerald-600 font-medium">Chat Online</Text>
//           </TouchableOpacity>

//           <TouchableOpacity onPress={() => Linking.openURL('mailto:mtextile70@yahoo.com')} className="flex-row items-center justify-between p-4 border-b border-slate-50 active:bg-slate-50">
//             <View className="flex-row items-center">
//               <Feather name="mail" size={16} color="#64748b" />
//               <Text className="text-xs font-semibold text-slate-700 ml-3">Email Support</Text>
//             </View>
//             <Text className="text-xs text-slate-400 font-mono">mtextile70@yahoo.com</Text>
//           </TouchableOpacity>

//           <TouchableOpacity onPress={() => Linking.openURL('https://instagram.com')} className="flex-row items-center justify-between p-4 active:bg-slate-50">
//             <View className="flex-row items-center">
//               <Feather name="instagram" size={16} color="#e1306c" />
//               <Text className="text-xs font-semibold text-slate-700 ml-3">Instagram Official</Text>
//             </View>
//             <Text className="text-xs text-slate-400 font-mono">@maitangaran_textiles</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* SHIPPINGS FOOTER DISCLOSURE */}
//       <View className="bg-slate-900 rounded-2xl p-5 items-center justify-center mb-8">
//         <Feather name="globe" size={20} color="#38bdf8" />
//         <Text className="text-white text-sm font-bold tracking-tight mt-2 text-center">Nationwide Logistics Network</Text>
//         <Text className="text-slate-400 text-xs font-normal mt-1 text-center px-4 leading-4">
//           Safe and secured distribution across all 36 Nigerian States. Delivery pipelines are completely tracked.
//         </Text>
//       </View>
//     </ScrollView>
//   );
// }





import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

export default function ContactUsScreen() {
  // Form States
  const [name, setName] = useState('Usman Adams');
  const [email, setEmail] = useState('usmanadams551@gmail.com');
  const [phone, setPhone] = useState('09018827571');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Validation check: button disables if any of these three are empty
  const isFormInvalid = !name.trim() || !email.trim() || !message.trim();

  const handleSendMessage = () => {
    if (isFormInvalid) return;
    
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setMessage('');
      Alert.alert("Message Sent", "Thank you! Our representative will get back to you shortly.");
    }, 1500);
  };

  const openWhatsApp = (phoneNumber: string) => {
    Linking.openURL(`whatsapp://send?phone=${phoneNumber.replace(/\s+/g, '')}`);
  };

  const openDialer = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber.replace(/\s+/g, '')}`);
  };

  const openMaps = () => {
    Linking.openURL('https://www.google.com/maps/place/Maitangaran+Textiles+Limited+Abuja/@9.0805177,7.4727197,17s/');
  };

  return (
    <ScrollView 
      className="flex-1 bg-slate-50/50" 
      showsVerticalScrollIndicator={false} 
      contentContainerStyle={{ padding: 20 }}
    >
      {/* INTRO HERO */}
      <View className="mt-2 mb-6">
        <Text className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Get In Touch</Text>
        <Text className="text-3xl font-black tracking-tighter text-slate-900 mt-1 leading-9">
          Send Us a Message
        </Text>
        <Text className="text-sm text-slate-500 font-normal mt-3 leading-6">
          For wholesale or retail inquiries, nationwide delivery, or premium fabric stock questions, please complete the sheet below or talk directly to our desk.
        </Text>
      </View>

      {/* INTERACTIVE FORM CONTAINER */}
      <View 
        className="bg-white border border-slate-100 rounded-2xl p-5 mb-6"
        style={{ elevation: 2, shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }}
      >
        <Text className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-4">Inquiry Form</Text>
        
        {/* Name Input */}
        <View className="mb-4">
          <Text className="text-[11px] font-semibold text-slate-500 mb-1.5 pl-1">Full Name *</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor="#94a3b8"
            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-slate-800 text-xs font-medium"
          />
        </View>

        {/* Email Input */}
        <View className="mb-4">
          <Text className="text-[11px] font-semibold text-slate-500 mb-1.5 pl-1">Email Address *</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="yourname@domain.com"
            placeholderTextColor="#94a3b8"
            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-slate-800 text-xs font-medium"
          />
        </View>

        {/* Phone Input */}
        <View className="mb-4">
          <Text className="text-[11px] font-semibold text-slate-500 mb-1.5 pl-1">Phone Number (Optional)</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="09000000000"
            placeholderTextColor="#94a3b8"
            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-slate-800 text-xs font-medium"
          />
        </View>

        {/* Message Input */}
        <View className="mb-5">
          <Text className="text-[11px] font-semibold text-slate-500 mb-1.5 pl-1">Your Message *</Text>
          <TextInput
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
            placeholder="Write details about your premium order rules, quantities, or styles here..."
            placeholderTextColor="#94a3b8"
            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-slate-800 text-xs font-medium min-h-[90px]"
            textAlignVertical="top"
          />
        </View>

        {/* Submit Button (Disabled state applied dynamically) */}
        <TouchableOpacity
          onPress={handleSendMessage}
          disabled={isFormInvalid || isSending}
          className={`w-full py-3.5 rounded-xl items-center justify-center active:opacity-95 ${
            isFormInvalid ? 'bg-slate-200' : 'bg-slate-900'
          }`}
        >
          {isSending ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text className={`text-xs font-bold uppercase tracking-wider ${
              isFormInvalid ? 'text-slate-400' : 'text-white'
            }`}>
              Dispatch Message
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* INTERACTIVE MAP COMPONENT CARD */}
      <View className="mb-6">
        <Text className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-3">Live Map Location</Text>
        <TouchableOpacity 
          onPress={openMaps}
          className="w-full bg-slate-200 rounded-2xl overflow-hidden border border-slate-200"
          style={{ elevation: 3, shadowOpacity: 0.08, shadowRadius: 10 }}
          activeOpacity={0.9}
        >
          {/* Simulated Premium Blueprint/Map Background Graphic */}
          <View className="bg-sky-100 h-40 w-full items-center justify-center relative px-6">
            {/* Minimalist Vector Grid Lines design simulated via styling */}
            <View className="absolute inset-0 opacity-20 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:16px_16px]" />
            
            {/* Center Pin Indicator */}
            <View className="bg-white p-3 rounded-full items-center justify-center shadow-md border border-sky-100">
              <Ionicons name="location" size={26} color="#ef4444" />
            </View>

            <View className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur px-2.5 py-1 rounded-lg">
              <Text className="text-[10px] font-bold text-white tracking-wide">Wuse II, Abuja</Text>
            </View>
          </View>

          {/* Map Footer Action Tray */}
          <View className="bg-white p-4 flex-row items-center justify-between">
            <View className="flex-1 pr-2">
              <Text className="text-xs font-bold text-slate-800">Maitangaran Textiles Limited</Text>
              <Text className="text-[11px] text-slate-400 mt-0.5" numberOfLines={1}>Plot 1723 Suite 19, Adetokunbo Ademola Cres</Text>
            </View>
            <View className="bg-blue-50 px-3 py-1.5 rounded-xl flex-row items-center">
              <Feather name="navigation" size={12} color="#2563eb" />
              <Text className="text-[11px] font-bold text-blue-600 ml-1">Navigate</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* OPERATIONS TIMES */}
      <View 
        className="bg-white border border-slate-100 rounded-2xl p-4 mb-6 flex-row items-center justify-between"
        style={{ elevation: 2, shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }}
      >
        <View className="flex-row items-center flex-1 pr-2">
          <Feather name="clock" size={16} color="#64748b" />
          <View className="ml-3">
            <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Showroom Hours</Text>
            <Text className="text-xs font-bold text-slate-800 mt-0.5">Mon - Sat: 9:00 AM – 6:00 PM</Text>
          </View>
        </View>
        <View className="bg-red-50 px-2.5 py-1 rounded-full">
          <Text className="text-[10px] font-bold text-red-500 uppercase">Sun Closed</Text>
        </View>
      </View>

      {/* SHOWROOM DETAILS */}
      <View className="mb-6">
        <Text className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-3">Our Operations Layout</Text>

        {/* Kano HQ */}
        <View 
          className="bg-white border border-slate-100 rounded-2xl p-4 mb-3"
          style={{ elevation: 2, shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }}
        >
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm font-bold text-slate-900">Kano Head Office</Text>
            <View className="bg-slate-100 px-2 py-0.5 rounded-full">
              <Text className="text-[9px] font-bold text-slate-700 uppercase tracking-wide">HQ</Text>
            </View>
          </View>
          <Text className="text-xs text-slate-500 leading-5">
            4 Fagge Ta Kudu, A.A. Maitangaran House, Opposite Kwari Market, Kano State.
          </Text>
        </View>
      </View>

      {/* DIRECT CONNECT TRAYS */}
      <View className="mb-8">
        <Text className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-3">Direct Connect Hub</Text>
        
        <View 
          className="border border-slate-100 rounded-2xl overflow-hidden bg-white"
          style={{ elevation: 2, shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }}
        >
          <TouchableOpacity onPress={() => openDialer('+2348032838463')} className="flex-row items-center justify-between p-4 border-b border-slate-50 active:bg-slate-50">
            <View className="flex-row items-center">
              <Feather name="phone" size={16} color="#64748b" />
              <Text className="text-xs font-semibold text-slate-700 ml-3">Call Kano HQ</Text>
            </View>
            <Text className="text-xs text-slate-400 font-mono">+234 803 283 8463</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => openWhatsApp('+2348032959574')} className="flex-row items-center justify-between p-4 border-b border-slate-50 active:bg-slate-50">
            <View className="flex-row items-center">
              <Ionicons name="logo-whatsapp" size={16} color="#16a34a" />
              <Text className="text-xs font-semibold text-slate-700 ml-3">WhatsApp Kano</Text>
            </View>
            <Text className="text-xs text-emerald-600 font-medium">Chat Online</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => openWhatsApp('+2348065498720')} className="flex-row items-center justify-between p-4 border-b border-slate-50 active:bg-slate-50">
            <View className="flex-row items-center">
              <Ionicons name="logo-whatsapp" size={16} color="#16a34a" />
              <Text className="text-xs font-semibold text-slate-700 ml-3">WhatsApp Abuja</Text>
            </View>
            <Text className="text-xs text-emerald-600 font-medium">Chat Online</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => Linking.openURL('mailto:mtextile70@yahoo.com')} className="flex-row items-center justify-between p-4 border-b border-slate-50 active:bg-slate-50">
            <View className="flex-row items-center">
              <Feather name="mail" size={16} color="#64748b" />
              <Text className="text-xs font-semibold text-slate-700 ml-3">Email Support</Text>
            </View>
            <Text className="text-xs text-slate-400 font-mono">mtextile70@yahoo.com</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => Linking.openURL('https://instagram.com')} className="flex-row items-center justify-between p-4 active:bg-slate-50">
            <View className="flex-row items-center">
              <Feather name="instagram" size={16} color="#e1306c" />
              <Text className="text-xs font-semibold text-slate-700 ml-3">Instagram Official</Text>
            </View>
            <Text className="text-xs text-slate-400 font-mono">@maitangaran_textiles</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* SHIPPINGS FOOTER DISCLOSURE */}
      <View className="bg-slate-900 rounded-2xl p-5 items-center justify-center mb-8">
        <Feather name="globe" size={20} color="#38bdf8" />
        <Text className="text-white text-sm font-bold tracking-tight mt-2 text-center">Nationwide Logistics Network</Text>
        <Text className="text-slate-400 text-xs font-normal mt-1 text-center px-4 leading-4">
          Safe and secured distribution across all 36 Nigerian States. Delivery pipelines are completely tracked.
        </Text>
      </View>
    </ScrollView>
  );
}