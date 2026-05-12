export default function DirectionDetail({ direction }) {
  return (
    <div className="bg-gray-50 p-6 border-t">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">日常在干什么</h4>
          <p className="text-sm text-gray-700 mb-4">{direction.dailyWork}</p>
          <h4 className="font-semibold text-gray-900 mb-2">核心痛点</h4>
          <p className="text-sm text-gray-700 mb-4">{direction.corePainPoint}</p>
          <h4 className="font-semibold text-gray-900 mb-2">你的护城河</h4>
          <p className="text-sm text-gray-700">{direction.moat}</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">大三必须啃透的课</h4>
          <ul className="list-disc list-inside text-sm text-gray-700 mb-4">
            {direction.courses.map(c => <li key={c}>{c}</li>)}
          </ul>
          <h4 className="font-semibold text-gray-900 mb-2">真实前景</h4>
          <p className="text-sm text-gray-700 mb-4">{direction.outlook}</p>
          <h4 className="font-semibold text-gray-900 mb-2">35岁风险</h4>
          <p className="text-sm text-gray-700">{direction.risk35}</p>
        </div>
      </div>
      <div className="mt-6">
        <h4 className="font-semibold text-gray-900 mb-3">对口岗位</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="text-left p-2">公司</th>
                <th className="text-left p-2">岗位</th>
                <th className="text-left p-2">薪资</th>
                <th className="text-left p-2">岗位数量</th>
              </tr>
            </thead>
            <tbody>
              {direction.jobs.map((job, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2">{job.company}</td>
                  <td className="p-2">{job.role}</td>
                  <td className="p-2">{job.salary}</td>
                  <td className="p-2">{job.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
