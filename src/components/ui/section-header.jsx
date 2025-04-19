/**
 * SectionHeader component for consistent section headers
 */
export default function SectionHeader({ title, children }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-bold text-gray-800 flex items-center">
        <span className="w-3 h-3 bg-blue-500 rounded-full mr-2" aria-hidden="true"></span>
        {title}
      </h2>
      {children}
    </div>
  )
}
